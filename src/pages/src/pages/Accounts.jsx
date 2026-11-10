import React, { useState } from 'react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Nubank', bank: 'Nubank', type: 'Conta Corrente', balance: 3450.20, color: 'bg-purple-600', initial: 'Nu' },
    { id: 2, name: 'Banco Inter', bank: 'Inter', type: 'Conta Digital', balance: 1200.00, color: 'bg-orange-500', initial: 'In' },
    { id: 3, name: 'Carteira (Dinheiro)', bank: 'Espécie', type: 'Carteira Física', balance: 250.00, color: 'bg-emerald-600', initial: 'R$' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Conta Corrente');
  const [balance, setBalance] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!name || !balance) return;

    const initial = name.substring(0, 2).toUpperCase();
    setAccounts([...accounts, {
      id: Date.now(),
      name,
      bank: name,
      type,
      balance: parseFloat(balance),
      color: 'bg-blue-600',
      initial
    }]);

    setName('');
    setBalance('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Contas Bancárias e Carteiras</h2>
          <p className="text-xs text-slate-500">Gestão de saldos por instituição bancária e carteiras físicas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          + Nova Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${acc.color} text-white flex items-center justify-center font-extrabold text-sm shadow-md`}>
                {acc.initial}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">{acc.name}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{acc.type}</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-slate-900">{formatMoney(acc.balance)}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Criar Nova Conta Bancária</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddAccount} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome da Conta (ex: Itaú, Bradesco, Carteira)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="Conta Corrente">Conta Corrente</option>
                <option value="Conta Poupança">Conta Poupança</option>
                <option value="Conta Pagamentos/Digital">Conta Pagamentos/Digital</option>
                <option value="Carteira Física">Carteira Física</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Saldo Inicial (R$)"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2">
                Salvar Conta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}