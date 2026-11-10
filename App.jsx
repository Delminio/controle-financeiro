import React, { useState, useEffect } from 'react';

export default function FinanceDashboard() {
  const [data, setData] = useState({ summary: { totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 }, transactions: [] });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api/transactions';

  const fetchData = async () => {
    const res = await fetch(API_URL);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, type })
    });

    setDescription('');
    setAmount('');
    fetchData();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-center mb-4">Controle Financeiro da Mãe</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-green-100 p-3 rounded text-center">
          <span className="text-xs text-green-700 font-bold block">Entradas</span>
          <span className="text-sm font-semibold text-green-800">R$ {data.summary.totalReceitas.toFixed(2)}</span>
        </div>
        <div className="bg-red-100 p-3 rounded text-center">
          <span className="text-xs text-red-700 font-bold block">Saídas</span>
          <span className="text-sm font-semibold text-red-800">R$ {data.summary.totalDespesas.toFixed(2)}</span>
        </div>
        <div className="bg-blue-100 p-3 rounded text-center">
          <span className="text-xs text-blue-700 font-bold block">Saldo</span>
          <span className={`text-sm font-bold ${data.summary.saldoFinal >= 0 ? 'text-blue-800' : 'text-red-600'}`}>
            R$ {data.summary.saldoFinal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Formulário Simples */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Descrição (ex: Mercado, Luz)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded font-semibold ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Despesa (-)
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded font-semibold ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Receita (+)
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
          Lançar
        </button>
      </form>

      {/* Histórico */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-3">Lançamentos</h2>
        <ul className="divide-y">
          {data.transactions.map((t) => (
            <li key={t.id} className="py-2 flex justify-between items-center text-sm">
              <span>{t.description}</span>
              <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}