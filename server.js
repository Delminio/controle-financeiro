const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Exemplo em memória (conecte ao banco SQL/NoSQL de sua preferência)
let transactions = [];

// Listar transações e resumo do saldo
app.get('/api/transactions', (req, res) => {
  const totalReceitas = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const saldoFinal = totalReceitas - totalDespesas;

  res.json({
    summary: {
      totalReceitas,
      totalDespesas,
      saldoFinal
    },
    transactions
  });
});

// Adicionar nova transação
app.post('/api/transactions', (req, res) => {
  const { description, amount, type } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const newTransaction = {
    id: Date.now(),
    description,
    amount: parseFloat(amount),
    type, // 'income' ou 'expense'
    date: new Date().toISOString()
  };

  transactions.unshift(newTransaction);
  res.status(201).json(newTransaction);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));    