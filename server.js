const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5t4RyiuCoMpm@ep-muddy-water-b6oq13dy.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id BIGINT PRIMARY KEY,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(10) NOT NULL,
        account VARCHAR(50) DEFAULT 'Nubank',
        person VARCHAR(50) DEFAULT 'Bernadete',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Garantir que as colunas novas existam caso a tabela já tenha sido criada antes
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS account VARCHAR(50) DEFAULT 'Nubank'`);
    await pool.query(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS person VARCHAR(50) DEFAULT 'Bernadete'`);
    console.log('Tabela e colunas atualizadas com sucesso no Neon.');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  }
};
initDb();

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
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
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { description, amount, type, account, person } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const id = Date.now();
  const parsedAmount = parseFloat(amount);
  const accountName = account || 'Nubank';
  const personName = person || 'Bernadete';

  try {
    const query = `
      INSERT INTO transactions (id, description, amount, type, account, person)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [id, description, parsedAmount, type, accountName, personName];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar transação' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));