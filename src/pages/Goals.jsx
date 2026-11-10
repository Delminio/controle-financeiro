import React, { useState } from 'react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !target) return;
    setGoals([...goals, {
      id: Date.now(),
      name,
      target: parseFloat(target),
      saved: parseFloat(saved) || 0
    }]);
    setName('');
    setTarget('');
    setSaved('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Metas Financeiras</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Defina e acompanhe o progresso dos seus objetivos pessoais</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
          + Nova Meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhuma meta financeira cadastrada.</p>
          <p className="text-[11px] text-slate-400">Clique em "+ Nova Meta" para definir o seu primeiro objetivo de economia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(g => {
            const percentage = Math.min(100, Math.round((g.saved / g.target) * 100));
            return (
              <div key={g.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-extrabold text-slate-800">{g.name}</h4>
                    <span className="text-xs font-bold text-emerald-600">{percentage}% Concluído</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Acumulado: {formatMoney(g.saved)}</span>
                    <span>Meta: {formatMoney(g.target)}</span>
                  </div>
                </div>
                <button onClick={() => setGoals(goals.filter(item => item.id !== g.id))} className="mt-4 text-xs font-bold text-rose-500 hover:underline cursor-pointer w-fit">Excluir</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Criar Nova Meta</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome da Meta (ex: Viagem, Carro Novo)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Desejado da Meta (R$)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Já Acumulado (R$)"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
              />
              <button type="submit" className="bg-emerald-600 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-md">
                Salvar Meta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}