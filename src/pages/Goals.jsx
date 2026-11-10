import React, { useState } from 'react';

export default function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Viagem de Fim de Ano', targetAmount: 5000, currentAmount: 2200 },
    { id: 2, title: 'Troca do Carro', targetAmount: 35000, currentAmount: 12000 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    setGoals([...goals, {
      id: Date.now(),
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0
    }]);

    setTitle('');
    setTargetAmount('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Metas Financeiras</h2>
          <p className="text-xs text-slate-500">Acompanhamento dos seus objetivos de curto e longo prazo</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(g => {
          const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

          return (
            <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-slate-800 text-sm">{g.title}</h3>
                <span className="text-xs font-bold text-emerald-600">{progress}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>

              <div className="flex justify-between text-xs text-slate-500 font-semibold mt-2">
                <span>Acumulado: {formatMoney(g.currentAmount)}</span>
                <span>Alvo: {formatMoney(g.targetAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Nova Meta Financeira</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddGoal} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título da meta (ex: Comprar casa, Viagem)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Alvo (R$)"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Meta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}