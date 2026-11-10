import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function FixedExpenses() {
  const [fixedItems, setFixedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('10');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    const newItem = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay, 10),
      frequency: 'Mensal'
    };
    setFixedItems([...fixedItems, newItem]);
    setTitle('');
    setAmount('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Contas Fixas e Recorrentes</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Gerencie compromissos periódicos reais da sua rotina financeira</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-emerald-200 transition cursor-pointer"
        >
          + Nova Conta Fixa
        </button>
      </div>

      {fixedItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhuma conta fixa cadastrada.</p>
          <p className="text-[11px] text-slate-400">Clique em "+ Nova Conta Fixa" para registrar compromissos recorrentes.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
          {fixedItems.map(item => (
            <div key={item.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  🔄
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Vencimento: Dia {item.dueDay} • {item.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-rose-600">{formatMoney(item.amount)}</span>
                <button onClick={() => setFixedItems(fixedItems.filter(f => f.id !== item.id))} className="text-xs text-rose-500 font-bold hover:underline cursor-pointer">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Nova Conta Fixa</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Descrição (ex: Aluguel, Internet)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                  required
                />
                <input
                  type="number"
                  placeholder="Dia de Vencimento"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                  required
                />
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-md">
                Salvar Conta Fixa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}