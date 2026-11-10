import React, { useState } from 'react';

export default function CreditCards() {
  const [cards, setCards] = useState([
    { id: 1, name: 'Nubank Roxinho', bank: 'Nubank', limit: 10000, used: 2607.15, closingDay: 5, dueDay: 12, color: 'from-purple-600 to-indigo-700' },
    { id: 2, name: 'Inter Black', bank: 'Banco Inter', limit: 5000, used: 0, closingDay: 1, dueDay: 8, color: 'from-orange-500 to-amber-600' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [bank, setBank] = useState('');
  const [limit, setLimit] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardName || !limit) return;
    const newCard = {
      id: Date.now(),
      name: cardName,
      bank: bank || 'Banco',
      limit: parseFloat(limit),
      used: 0,
      closingDay: 5,
      dueDay: 15,
      color: 'from-slate-700 to-slate-900'
    };
    setCards([...cards, newCard]);
    setCardName('');
    setBank('');
    setLimit('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Meus Cartões de Crédito</h2>
          <p className="text-xs text-slate-500">Gestão de limites, faturas e vencimentos sem duplicar despesas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Adicionar Cartão
        </button>
      </div>

      {/* Cards Visuais de Cartões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(c => {
          const available = c.limit - c.used;
          const percentage = Math.min(100, Math.round((c.used / c.limit) * 100));

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className={`p-6 bg-gradient-to-r ${c.color} text-white flex flex-col justify-between h-44 shadow-inner`}>
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-lg tracking-wider">{c.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-semibold">{c.bank}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/70 block">Fatura Atual</span>
                  <span className="text-2xl font-black tracking-tight">{formatMoney(c.used)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-white/80 font-medium">
                  <span>Fechamento: Dia {c.closingDay}</span>
                  <span>Vencimento: Dia {c.dueDay}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Limite Utilizado: {percentage}%</span>
                  <span>Disponível: {formatMoney(available)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Cartão */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Cadastrar Novo Cartão</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome do Cartão (ex: Nubank, XP)"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <input
                type="text"
                placeholder="Banco Emissor"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
              <input
                type="number"
                placeholder="Limite Total (R$)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Cartão
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}