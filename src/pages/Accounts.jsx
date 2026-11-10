import React, { useState } from 'react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Conta Corrente');
  const [balance, setBalance] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!name || balance === '') return;

    setAccounts([...accounts, {
      id: Date.now(),
      name,
      type,
      balance: parseFloat(balance),
      initial: name.substring(0, 2).toUpperCase()
    }]);

    setName('');
    setBalance('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esta conta?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Contas Bancárias e Carteiras</h2>
          <p className="text-xs text-slate-500 font-medium">Gestão de saldos por instituição bancária</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
          + Nova Conta
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 font-medium">
          Nenhuma conta bancária cadastrada. Clique em "+ Nova Conta" para adicionar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  {acc.initial}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{acc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{acc.type}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-black text-slate-900">{formatMoney(acc.balance)}</span>
                <button onClick={() => handleDelete(acc.id)} className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Criar Nova Conta Bancária</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddAccount} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome da Conta (ex: Itaú, Bradesco, Carteira)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
              >
                <option value="Conta Corrente">Conta Corrente</option>
                <option value="Conta Poupança">Conta Poupança</option>
                <option value="Conta Digital">Conta Digital</option>
                <option value="Carteira Física">Carteira Física</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Saldo Inicial (R$)"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl mt-2 cursor-pointer">
                Salvar Conta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}