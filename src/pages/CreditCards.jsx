import React, { useState } from 'react';

export default function CreditCards() {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [bank, setBank] = useState('');
  const [limit, setLimit] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardName || !limit) return;
    setCards([...cards, {
      id: Date.now(),
      name: cardName,
      bank: bank || 'Banco',
      limit: parseFloat(limit),
      used: 0,
      closingDay: 5,
      dueDay: 12
    }]);
    setCardName('');
    setBank('');
    setLimit('');
    setShowModal(false);
  };

  const handleDeleteCard = (id) => {
    if (confirm('Deseja excluir este cartão?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Cartões de Crédito</h2>
          <p className="text-xs text-slate-500 font-medium">Gestão de limites e faturas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
          + Adicionar Cartão
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 font-medium">
          Nenhum cartão cadastrado. Clique em "+ Adicionar Cartão" para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map(c => (
            <div key={c.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">{c.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{c.bank}</p>
                </div>
                <button onClick={() => handleDeleteCard(c.id)} className="text-xs text-rose-500 font-bold hover:underline cursor-pointer">Apagar</button>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>Limite Total: {formatMoney(c.limit)}</span>
                <span>Fatura: {formatMoney(c.used)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Cadastrar Novo Cartão</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome do Cartão (ex: Nubank, XP)"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <input
                type="text"
                placeholder="Banco Emissor"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
              />
              <input
                type="number"
                placeholder="Limite Total (R$)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl mt-2 cursor-pointer">
                Salvar Cartão
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}