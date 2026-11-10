import React, { useState } from 'react';

export default function Installments() {
  const [installments, setInstallments] = useState([
    {
      id: 1,
      title: 'iPhone 15 Pro',
      cardName: 'Nubank Roxinho',
      totalAmount: 6000,
      totalInstallments: 12,
      paidInstallments: 4,
      installmentAmount: 500,
      dueDay: 12
    },
    {
      id: 2,
      title: 'Geladeira Inverter',
      cardName: 'Inter Black',
      totalAmount: 3600,
      totalInstallments: 10,
      paidInstallments: 2,
      installmentAmount: 360,
      dueDay: 8
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [cardName, setCardName] = useState('Nubank Roxinho');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddInstallment = (e) => {
    e.preventDefault();
    if (!title || !totalAmount || !totalInstallments) return;

    const total = parseFloat(totalAmount);
    const count = parseInt(totalInstallments, 10);
    const newItem = {
      id: Date.now(),
      title,
      cardName,
      totalAmount: total,
      totalInstallments: count,
      paidInstallments: 0,
      installmentAmount: total / count,
      dueDay: 10
    };

    setInstallments([...installments, newItem]);
    setTitle('');
    setTotalAmount('');
    setTotalInstallments('');
    setShowModal(false);
  };

  const handlePayInstallment = (id) => {
    setInstallments(installments.map(item => {
      if (item.id === id && item.paidInstallments < item.totalInstallments) {
        return { ...item, paidInstallments: item.paidInstallments + 1 };
      }
      return item;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Compras Parceladas</h2>
          <p className="text-xs text-slate-500">Acompanhamento do saldo devedor e parcelas futuras sem contabilizar como despesa antecipada</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Nova Compra Parcelada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {installments.map(item => {
          const remainingAmount = item.totalAmount - (item.paidInstallments * item.installmentAmount);
          const remainingInstallments = item.totalInstallments - item.paidInstallments;
          const progress = Math.round((item.paidInstallments / item.totalInstallments) * 100);

          return (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">{item.title}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">{item.cardName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor da Parcela</span>
                    <span className="text-sm font-extrabold text-slate-800">{formatMoney(item.installmentAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Saldo Restante</span>
                    <span className="text-sm font-extrabold text-rose-600">{formatMoney(remainingAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>Progresso: {item.paidInstallments} de {item.totalInstallments} parcelas</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">Restam {remainingInstallments} parcelas</span>
                <button
                  onClick={() => handlePayInstallment(item.id)}
                  disabled={remainingInstallments === 0}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  {remainingInstallments === 0 ? 'Quitado' : 'Pagar Parcela'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Nova Compra Parcelada</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddInstallment} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome do produto ou compromisso"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor Total (R$)"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  required
                />
                <input
                  type="number"
                  placeholder="Nº de Parcelas"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  required
                />
              </div>
              <select
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="Nubank Roxinho">Nubank Roxinho</option>
                <option value="Inter Black">Inter Black</option>
              </select>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Compra Parcelada
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}