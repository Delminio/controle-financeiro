import React, { useState } from 'react';

export default function Emergency() {
  const [reserves, setReserves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !target) return;
    setReserves([...reserves, {
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
          <h2 className="text-xl font-black text-slate-900">Reserva Financeira / Emergência</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Proteção financeira e fundos de segurança reais</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
          + Nova Reserva
        </button>
      </div>

      {reserves.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhuma reserva financeira cadastrada.</p>
          <p className="text-[11px] text-slate-400">Adicione o seu fundo de emergência para manter a estabilidade financeira.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reserves.map(r => {
            const percentage = Math.min(100, Math.round((r.saved / r.target) * 100));
            return (
              <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 mb-1">{r.name}</h4>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                    <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Acumulado: {formatMoney(r.saved)}</span>
                    <span>Objetivo: {formatMoney(r.target)}</span>
                  </div>
                </div>
                <button onClick={() => setReserves(reserves.filter(item => item.id !== r.id))} className="mt-4 text-xs font-bold text-rose-500 hover:underline cursor-pointer w-fit">Excluir</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Criar Reserva Financeira</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome da Reserva (ex: Fundo de Emergência 6 Meses)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Desejado (R$)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Já Guardado (R$)"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
              />
              <button type="submit" className="bg-emerald-600 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-md">
                Salvar Reserva
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}