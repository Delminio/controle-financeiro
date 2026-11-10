import React, { useState } from 'react';

export default function FixedExpenses() {
  const [items, setItems] = useState([
    { id: 1, title: 'Aluguel do Apê', amount: 1800, dueDay: 10, category: 'Moradia', recurrence: 'Mensal' },
    { id: 2, title: 'Internet Fibra', amount: 120, dueDay: 15, category: 'Contas', recurrence: 'Mensal' },
    { id: 3, title: 'Academia', amount: 99, dueDay: 5, category: 'Saúde', recurrence: 'Mensal' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('10');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setItems([...items, {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay, 10),
      category: 'Fixa',
      recurrence: 'Mensal'
    }]);

    setTitle('');
    setAmount('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Contas Fixas e Recorrentes</h2>
          <p className="text-xs text-slate-500">Compromissos automatizados que repetem semanalmente, mensalmente ou anualmente</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Nova Conta Fixa
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  🔄
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400">Vencimento: Dia {item.dueDay} • {item.recurrence}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600">{formatMoney(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Adicionar Conta Recorrente</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Descrição (ex: Aluguel, Netflix, Luz)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor Fixo (R$)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  required
                />
                <input
                  type="number"
                  placeholder="Dia de Vencimento"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  required
                />
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Conta Recorrente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}