import React, { useState } from 'react';

export default function Debts() {
  const [debts, setDebts] = useState([
    { id: 1, personOrInstitution: 'Irmão (Carlos)', type: 'emprestei', totalAmount: 500, paidAmount: 200 },
    { id: 2, personOrInstitution: 'Banco Itaú (Consignado)', type: 'peguei', totalAmount: 4000, paidAmount: 1500 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [personOrInstitution, setPersonOrInstitution] = useState('');
  const [type, setType] = useState('emprestei');
  const [totalAmount, setTotalAmount] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!personOrInstitution || !totalAmount) return;

    setDebts([...debts, {
      id: Date.now(),
      personOrInstitution,
      type,
      totalAmount: parseFloat(totalAmount),
      paidAmount: 0
    }]);

    setPersonOrInstitution('');
    setTotalAmount('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Empréstimos e Dívidas</h2>
          <p className="text-xs text-slate-500">Controle de valores a receber e compromissos tomados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Registar Empréstimo/Dívida
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {debts.map(d => {
          const remaining = d.totalAmount - d.paidAmount;
          const isLent = d.type === 'emprestei';

          return (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-extrabold text-slate-800 text-sm">{d.personOrInstitution}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${isLent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {isLent ? 'Dinheiro que emprestei' : 'Dívida que assumi'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-2 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="text-xs font-bold text-slate-700">{formatMoney(d.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Em Aberto</span>
                    <span className={`text-xs font-extrabold ${isLent ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatMoney(remaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Registar Empréstimo / Dívida</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddDebt} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Pessoa ou Instituição"
                value={personOrInstitution}
                onChange={(e) => setPersonOrInstitution(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="emprestei">Emprestei dinheiro a alguém</option>
                <option value="peguei">Peguei emprestado / Dívida</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Valor Total (R$)"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Registo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}