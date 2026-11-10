const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');

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
  if (!token) return res.status(401).json({ error: 'Acesso negado. Token ausente.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// Inicialização das Tabelas do Sistema Financeiro no Neon
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

    // 2. Tabela de Transações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id BIGINT PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(10) NOT NULL,
        category VARCHAR(100) DEFAULT 'Outros',
        account VARCHAR(50) DEFAULT 'Nubank',
        person VARCHAR(50) DEFAULT 'Bernadete (Mae)',
        status VARCHAR(20) DEFAULT 'Pago',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Tabela de Cartões de Crédito
    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_cards (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        bank VARCHAR(50),
        credit_limit NUMERIC NOT NULL,
        closing_day INT NOT NULL,
        due_day INT NOT NULL
      )
    `);

    // 4. Tabela de Parcelas / Compras Parceladas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS installment_purchases (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        total_amount NUMERIC NOT NULL,
        total_installments INT NOT NULL,
        paid_installments INT DEFAULT 0,
        installment_amount NUMERIC NOT NULL,
        card_name VARCHAR(100),
        due_day INT DEFAULT 10
      )
    `);

    // 5. Tabela de Investimentos e Reserva de Emergência
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        amount NUMERIC NOT NULL,
        institution VARCHAR(100)
      )
    `);

    // 6. Tabela de Empréstimos e Dívidas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS debts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        person_or_institution VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'emprestei' ou 'peguei'
        total_amount NUMERIC NOT NULL,
        paid_amount NUMERIC DEFAULT 0,
        due_date DATE
      )
    `);

    // 7. Tabela de Metas Financeiras
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        target_amount NUMERIC NOT NULL,
        current_amount NUMERIC DEFAULT 0,
        target_date DATE
      )
    `);

    console.log('Estrutura de tabelas SaaS inicializada com sucesso no Neon.');
  } catch (err) {
    console.error('Erro ao inicializar tabelas:', err);
  }
};
initDb();

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos.' });

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email.toLowerCase().trim(), hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Credenciais inválidas.' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// --- TRANSACTIONS ROUTES ---
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    const transactions = result.rows.map(t => ({ ...t, amount: parseFloat(t.amount) }));

    const totalReceitas = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalDespesas = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const saldoFinal = totalReceitas - totalDespesas;

    res.json({ summary: { totalReceitas, totalDespesas, saldoFinal }, transactions });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao procurar lançamentos.' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { description, amount, type, category, account, person, status } = req.body;
  if (!description || !amount || !type) return res.status(400).json({ error: 'Dados incompletos.' });

  const id = Date.now();
  try {
    const query = `
      INSERT INTO transactions (id, user_id, description, amount, type, category, account, person, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;
    const result = await pool.query(query, [
      id, req.user.id, description, parseFloat(amount), type,
      category || 'Outros', account || 'Nubank', person || 'Bernadete (Mae)', status || 'Pago'
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar lançamento.' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar lançamento.' });
  }
});

// --- EXPORT TO EXCEL ROUTE (.XLSX MULTI-ABA) ---
app.get('/api/export/excel', authenticateToken, async (req, res) => {
  try {
    const transResult = await pool.query('SELECT description, amount, type, category, account, person, status, date FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    const formattedTrans = transResult.rows.map(t => ({
      Descrição: t.description,
      'Valor (R$)': parseFloat(t.amount),
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Conta: t.account,
      Pessoa: t.person,
      Status: t.status,
      Data: new Date(t.date).toLocaleDateString('pt-BR')
    }));

    const workbook = XLSX.utils.book_new();
    const sheetTrans = XLSX.utils.json_to_sheet(formattedTrans);
    XLSX.utils.book_append_sheet(workbook, sheetTrans, 'Lançamentos');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Relatorio_Financeiro.xlsx"');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar arquivo Excel.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));