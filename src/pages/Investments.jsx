import React, { useState } from 'react';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    setInvestments([...investments, {
      id: Date.now(),
      name,
      amount: parseFloat(amount)
    }]);
    setName('');
    setAmount('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Investimentos</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Acompanhamento do seu patrimônio e aplicações reais</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
          + Novo Investimento
        </button>
      </div>

      {investments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhum investimento cadastrado.</p>
          <p className="text-[11px] text-slate-400">Adicione a sua primeira aplicação para acompanhar o seu patrimônio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investments.map(inv => (
            <div key={inv.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 mb-1">{inv.name}</h4>
                <p className="text-xs font-semibold text-emerald-600">Aplicado: {formatMoney(inv.amount)}</p>
              </div>
              <button onClick={() => setInvestments(investments.filter(i => i.id !== inv.id))} className="mt-4 text-xs font-bold text-rose-500 hover:underline cursor-pointer w-fit">Excluir</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Cadastrar Investimento</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome do Ativo (ex: Tesouro Direto, CDB)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor Aplicado (R$)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-md">
                Salvar Investimento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}