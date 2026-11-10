const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_organize_financeiro_2026';
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5t4RyiuCoMpm@ep-muddy-water-b6oq13dy.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

// Middleware de Autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// Inicialização da Estrutura do Banco de Dados
const initDb = async () => {
  try {
    // 1. Tabela de Utilizadores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Tabela de Transações com vínculo ao user_id
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id BIGINT PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(10) NOT NULL,
        account VARCHAR(50) DEFAULT 'Nubank',
        person VARCHAR(50) DEFAULT 'Bernadete (Mae)',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Garantir coluna user_id se a tabela já existia
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE CASCADE`);

    // Criar utilizador padrão para a Bernadete (se não existir)
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['bernadete@financeiro.com']);
    let defaultUserId;

    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('123', 10);
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        ['Bernadete', 'bernadete@financeiro.com', hashedPassword]
      );
      defaultUserId = newUser.rows[0].id;
      console.log('Utilizador por defeito da Bernadete criado com sucesso.');
    } else {
      defaultUserId = userCheck.rows[0].id;
    }

    // Vincular lançamentos antigos sem utilizador à conta da Bernadete
    await pool.query('UPDATE transactions SET user_id = $1 WHERE user_id IS NULL', [defaultUserId]);

    console.log('Banco de dados inicializado com suporte Multi-tenant.');
  } catch (err) {
    console.error('Erro na inicialização do banco de dados:', err);
  }
};
initDb();

// --- ROTAS DE AUTENTICAÇÃO ---

// Registo de novo utilizador
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email.toLowerCase().trim(), hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

// Dados do utilizador logado
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- ROTAS PROTEGIDAS DE TRANSAÇÕES (MULTI-TENANT) ---

// Buscar transações apenas do utilizador logado
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    const transactions = result.rows.map(t => ({
      ...t,
      amount: parseFloat(t.amount)
    }));

    const totalReceitas = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalDespesas = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const saldoFinal = totalReceitas - totalDespesas;

    res.json({
      summary: { totalReceitas, totalDespesas, saldoFinal },
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao procurar transações.' });
  }
});

// Adicionar transação vinculada ao utilizador logado
app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { description, amount, type, account, person } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  const id = Date.now();
  const parsedAmount = parseFloat(amount);
  const accountName = account || 'Nubank';
  const personName = person || 'Bernadete (Mae)';

  try {
    const query = `
      INSERT INTO transactions (id, user_id, description, amount, type, account, person)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [id, req.user.id, description, parsedAmount, type, accountName, personName];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao guardar transação.' });
  }
});

// Eliminar transação garantindo pertencimento ao utilizador logado
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lançamento não encontrado ou não autorizado.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar lançamento.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));