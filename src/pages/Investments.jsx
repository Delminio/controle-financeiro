import React, { useState } from 'react';

export default function Investments() {
  const [investments, setInvestments] = useState([
    { id: 1, title: 'CDB Liquidez Diária', category: 'CDB', amount: 15000, institution: 'Banco Sofisa' },
    { id: 2, title: 'Tesouro Selic 2029', category: 'Tesouro Direto', amount: 8000, institution: 'XP Investimentos' },
    { id: 3, title: 'Fundo Imobiliário HGLG11', category: 'Fundos Imobiliários', amount: 4500, institution: 'NuInvest' }
  ]);

  const [reserveAmount, setReserveAmount] = useState(15000);
  const monthlyEssentialExpenses = 3000;

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CDB');
  const [amount, setAmount] = useState('');
  const [institution, setInstitution] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const totalInvested = investments.reduce((acc, i) => acc + i.amount, 0);
  const monthsCovered = (reserveAmount / monthlyEssentialExpenses).toFixed(1);

  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setInvestments([...investments, {
      id: Date.now(),
      title,
      category,
      amount: parseFloat(amount),
      institution: institution || 'Instituição'
    }]);

    setTitle('');
    setAmount('');
    setInstitution('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Investimentos & Reserva de Emergência</h2>
          <p className="text-xs text-slate-500">Gestão de patrimônio aplicado sem misturar com despesas correntes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Aplicar Investimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Patrimônio Investido Total</span>
            <span className="text-3xl font-black text-slate-900">{formatMoney(totalInvested)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-semibold">
            <span>Aplicações Ativas: {investments.length}</span>
            <span>Diversificação: OK</span>
          </div>
        </div>

        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Reserva de Emergência</span>
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">{monthsCovered} Meses de Custo</span>
            </div>
            <span className="text-3xl font-black tracking-tight">{formatMoney(reserveAmount)}</span>
          </div>
          <p className="text-[11px] text-emerald-100 mt-4">
            Cobre cerca de {monthsCovered} meses com base num custo essencial estimado de {formatMoney(monthlyEssentialExpenses)}/mês.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Minhas Aplicações</h3>
        <div className="divide-y divide-slate-100">
          {investments.map(inv => (
            <div key={inv.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{inv.title}</p>
                <p className="text-[10px] text-slate-400">{inv.category} • {inv.institution}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">{formatMoney(inv.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Novo Investimento</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddInvestment} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título da aplicação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="CDB">CDB</option>
                <option value="Tesouro Direto">Tesouro Direto</option>
                <option value="Poupança">Poupança</option>
                <option value="Ações">Ações</option>
                <option value="Fundos Imobiliários">Fundos Imobiliários</option>
                <option value="Criptomoedas">Criptomoedas</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Valor Aplicado (R$)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <input
                type="text"
                placeholder="Instituição ou Corretora"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Aplicação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}