import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [people, setPeople] = useState([]);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bankName, setBankName] = useState('Nubank');
  const [accountType, setAccountType] = useState('Conta Corrente');
  const [balance, setBalance] = useState('');
  const [personId, setPersonId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [accRes, peoRes, cardRes] = await Promise.all([
        fetchWithAuth('/bank-accounts'),
        fetchWithAuth('/people'),
        fetchWithAuth('/credit-cards')
      ]);

      if (accRes.ok) setAccounts(await accRes.json());
      if (peoRes.ok) {
        const peoData = await peoRes.json();
        setPeople(peoData);
        if (peoData.length > 0 && !personId) setPersonId(peoData[0].id);
      }
      if (cardRes.ok) setCards(await cardRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!bankName || !personId) return alert('Selecione o banco e a pessoa responsável.');

    try {
      const res = await fetchWithAuth('/bank-accounts', {
        method: 'POST',
        body: JSON.stringify({
          bank_name: bankName,
          account_type: accountType,
          balance: parseFloat(balance) || 0,
          person_id: parseInt(personId, 10)
        })
      });

      if (res.ok) {
        setBankName('Nubank');
        setBalance('');
        setShowModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao criar conta.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir esta conta bancária?')) return;
    try {
      await fetchWithAuth('/bank-accounts/' + id, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Contas Bancárias e Carteiras</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Gestão de saldos, cartões vinculados e responsáveis</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer transition">
          + Nova Conta
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 font-medium">
          Nenhuma conta bancária cadastrada. Clique em "+ Nova Conta" para adicionar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(acc => {
            const accCards = cards.filter(c => c.account_id === acc.id);
            return (
              <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-md">
                        {acc.bank_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{acc.bank_name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">{acc.account_type} • Resp: {acc.person_name || 'Não atribuído'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{formatMoney(acc.balance)}</span>
                  </div>

                  {accCards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Cartões Vinculados:</p>
                      <div className="flex flex-col gap-1.5">
                        {accCards.map(c => (
                          <div key={c.id} className="bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700">{c.card_name}</span>
                            <span className="text-emerald-600 font-extrabold">R$ {parseFloat(c.card_limit).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button onClick={() => handleDelete(acc.id)} className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer">Excluir Conta</button>
                </div>
              </div>
            );
          })}
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
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Banco / Instituição</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                >
                  <option value="Nubank">Nubank</option>
                  <option value="Inter">Inter</option>
                  <option value="Bradesco">Bradesco</option>
                  <option value="Santander">Santander</option>
                  <option value="Itaú">Itaú</option>
                  <option value="Banco do Brasil">Banco do Brasil</option>
                  <option value="C6 Bank">C6 Bank</option>
                  <option value="Neon">Neon</option>
                  <option value="XP">XP</option>
                  <option value="Carteira">Carteira (Dinheiro)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Conta</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                >
                  <option value="Conta Corrente">Conta Corrente</option>
                  <option value="Conta Poupança">Conta Poupança</option>
                  <option value="Conta Digital">Conta Digital</option>
                  <option value="Carteira Física">Carteira Física</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pessoa Responsável (Obrigatório)</label>
                <select
                  value={personId}
                  onChange={(e) => setPersonId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                >
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Saldo Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                />
              </div>

              <button type="submit" className="bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl mt-2 cursor-pointer shadow-md">
                Salvar Conta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}