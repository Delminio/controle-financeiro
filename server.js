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

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS people (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        nickname VARCHAR(50),
        observation TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        bank_name VARCHAR(100) NOT NULL,
        account_type VARCHAR(50) DEFAULT 'Conta Corrente',
        balance NUMERIC DEFAULT 0,
        person_id INT REFERENCES people(id) ON DELETE SET NULL,
        color_theme VARCHAR(50) DEFAULT 'from-purple-700 to-purple-950'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_cards (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        account_id INT,
        card_name VARCHAR(100),
        bank_emitter VARCHAR(100),
        holder_name VARCHAR(100),
        brand VARCHAR(50),
        last_digits VARCHAR(4),
        card_limit NUMERIC,
        closing_day INT,
        due_day INT,
        color_bg VARCHAR(100),
        dark_mode BOOLEAN
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id BIGINT PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(10) NOT NULL,
        category VARCHAR(100) DEFAULT 'Outros',
        account VARCHAR(50) DEFAULT 'Geral',
        person VARCHAR(50) DEFAULT 'Principal',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        event_type VARCHAR(50) DEFAULT 'financeiro',
        amount NUMERIC DEFAULT 0,
        event_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Pendente'
      )
    `);

    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS account_id INT`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS card_id INT`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Dinheiro'`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pago'`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS installment_current INT DEFAULT 1`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS installment_total INT DEFAULT 1`).catch(() => {});
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS due_date TIMESTAMP`).catch(() => {});

    console.log('Base de dados SaaS estruturada e migrações aplicadas com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar base de dados:', err);
  }
};
initDb();

// Autenticação
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
    await pool.query('INSERT INTO people (user_id, name, nickname) VALUES ($1, $2, $3)', [user.id, name, 'Principal']);

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

// Pessoas
app.get('/api/people', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people WHERE user_id = $1 ORDER BY id ASC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pessoas.' });
  }
});

// Contas Bancárias
app.get('/api/bank-accounts', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT ba.*, p.name as person_name 
      FROM bank_accounts ba 
      LEFT JOIN people p ON ba.person_id = p.id 
      WHERE ba.user_id = $1 
      ORDER BY ba.id DESC
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contas bancárias.' });
  }
});

// Cartões de Crédito
app.get('/api/credit-cards', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT cc.*, ba.bank_name as account_bank, p.name as person_name
      FROM credit_cards cc
      LEFT JOIN bank_accounts ba ON cc.account_id = ba.id
      LEFT JOIN people p ON ba.person_id = p.id
      WHERE cc.user_id = $1
      ORDER BY cc.id DESC
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cartões.' });
  }
});

// Transações com Resumo Separado (Débito vs Crédito)
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    const transactions = result.rows.map(t => ({ ...t, amount: parseFloat(t.amount) }));

    const totalReceitas = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    // Despesas à Vista (Débito, PIX, Dinheiro, etc.) -> Descontam do Saldo
    const totalDespesasDebito = transactions
      .filter(t => t.type === 'expense' && t.payment_method !== 'Cartão de Crédito')
      .reduce((acc, t) => acc + t.amount, 0);

    // Despesas no Cartão de Crédito -> Comprometem Limite/Fatura
    const totalDespesasCredito = transactions
      .filter(t => t.type === 'expense' && t.payment_method === 'Cartão de Crédito')
      .reduce((acc, t) => acc + t.amount, 0);

    const saldoFinal = totalReceitas - totalDespesasDebito;

    res.json({
      summary: {
        totalReceitas,
        totalDespesasDebito,
        totalDespesasCredito,
        saldoFinal
      },
      transactions
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao procurar lançamentos.' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { description, amount, type, category, account, account_id, card_id, person, payment_method, status, installment_current, installment_total, due_date } = req.body;
  if (!description || !amount || !type) return res.status(400).json({ error: 'Dados incompletos.' });

  const id = Date.now();
  try {
    const query = `
      INSERT INTO transactions (id, user_id, description, amount, type, category, account, account_id, card_id, person, payment_method, status, installment_current, installment_total, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *
    `;
    const result = await pool.query(query, [
      id, 
      req.user.id, 
      description, 
      parseFloat(amount), 
      type,
      category || 'Outros', 
      account || 'Geral', 
      account_id ? parseInt(account_id, 10) : null, 
      card_id ? parseInt(card_id, 10) : null, 
      person || 'Principal',
      payment_method || 'Dinheiro', 
      status || 'Pago', 
      installment_current || 1, 
      installment_total || 1, 
      due_date || null
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro detalhado ao gravar transação:', err);
    res.status(500).json({ error: 'Erro no banco: ' + err.message });
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

// Exportar Excel
app.get('/api/export/excel', authenticateToken, async (req, res) => {
  try {
    const transResult = await pool.query('SELECT description, amount, type, category, account, payment_method, status, date FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    const formattedTrans = transResult.rows.map(t => ({
      Descrição: t.description,
      'Valor (R$)': parseFloat(t.amount),
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Forma: t.payment_method,
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
    res.status(500).json({ error: 'Erro ao gerar arquivo Excel.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API SaaS rodando na porta ${PORT}`));