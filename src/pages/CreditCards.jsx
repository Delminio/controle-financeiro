import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

const BANKS_CONFIG = [
  { id: 'Nubank', name: 'Nubank', bg: 'from-purple-700 via-purple-800 to-purple-950', textColor: 'text-white', logo: 'nu' },
  { id: 'Inter', name: 'Inter', bg: 'from-orange-500 via-orange-600 to-amber-700', textColor: 'text-white', logo: 'inter' },
  { id: 'Bradesco', name: 'Bradesco', bg: 'from-red-600 via-red-700 to-red-950', textColor: 'text-white', logo: 'bradesco' },
  { id: 'Santander', name: 'Santander', bg: 'from-red-700 via-red-800 to-red-950', textColor: 'text-white', logo: 'Santander' },
  { id: 'Itaú', name: 'Itaú', bg: 'from-orange-600 via-amber-600 to-orange-800', textColor: 'text-white', logo: 'Itaú' },
  { id: 'Banco do Brasil', name: 'Banco do Brasil', bg: 'from-amber-400 via-yellow-500 to-blue-900', textColor: 'text-blue-950', logo: 'BB' },
  { id: 'C6 Bank', name: 'C6 Bank', bg: 'from-slate-800 via-zinc-900 to-black', textColor: 'text-white', logo: 'C6' },
  { id: 'XP', name: 'XP', bg: 'from-zinc-950 via-black to-zinc-900', textColor: 'text-white', logo: 'XP' }
];

export default function CreditCards() {
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [accountId, setAccountId] = useState('');
  const [cardName, setCardName] = useState('');
  const [holderName, setHolderName] = useState('Delminio Silva');
  const [brand, setBrand] = useState('Mastercard');
  const [lastDigits, setLastDigits] = useState('4321');
  const [cardLimit, setCardLimit] = useState('');
  const [dueDay, setDueDay] = useState('10');
  const [selectedBank, setSelectedBank] = useState(BANKS_CONFIG[0]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = async () => {
    try {
      const [cardRes, accRes] = await Promise.all([
        fetchWithAuth('/credit-cards'),
        fetchWithAuth('/bank-accounts')
      ]);
      if (cardRes.ok) setCards(await cardRes.json());
      if (accRes.ok) {
        const accData = await accRes.json();
        setAccounts(accData);
        if (accData.length > 0 && !accountId) setAccountId(accData[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!accountId) return alert('Você precisa vincular o cartão a uma conta bancária cadastrada.');
    if (!cardName || !cardLimit) return alert('Preencha o nome do cartão e o limite.');

    try {
      const res = await fetchWithAuth('/credit-cards', {
        method: 'POST',
        body: JSON.stringify({
          account_id: parseInt(accountId, 10),
          card_name: cardName,
          bank_emitter: selectedBank.name,
          holder_name: holderName,
          brand,
          last_digits: lastDigits || '0000',
          card_limit: parseFloat(cardLimit),
          closing_day: 5,
          due_day: parseInt(dueDay, 10) || 10,
          color_bg: selectedBank.bg,
          dark_mode: darkMode
        })
      });

      if (res.ok) {
        setCardName('');
        setCardLimit('');
        setShowModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao criar cartão.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este cartão?')) return;
    try {
      await fetchWithAuth('/credit-cards/' + id, { method: 'DELETE' });
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
          <h2 className="text-xl font-black text-slate-900">Cartões de Crédito</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Gerenciamento de limites, faturas e contas vinculadas</p>
        </div>
        <button 
          onClick={() => {
            if (accounts.length === 0) {
              alert('Cadastre primeiro uma Conta Bancária antes de criar um cartão.');
              return;
            }
            setShowModal(true);
          }} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer transition"
        >
          + Adicionar Cartão
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 font-medium">
          Nenhum cartão cadastrado. Clique em "+ Adicionar Cartão" para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className={`w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-br ${c.color_bg} p-4 flex flex-col justify-between shadow-md mb-4 text-white relative overflow-hidden`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider">{c.bank_emitter}</span>
                    <span className="text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded">{c.card_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded bg-amber-300 border border-amber-400/50"></div>
                    <span className="text-xs font-mono tracking-widest">•••• •••• •••• {c.last_digits}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider opacity-75">Titular</p>
                      <p className="text-xs font-bold">{c.holder_name}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">{c.brand}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                  <span>Limite Total:</span>
                  <strong className="text-slate-900">{formatMoney(c.card_limit)}</strong>
                </div>
                <p className="text-[11px] text-slate-400">Conta: {c.account_bank} • Vencimento: Dia {c.due_day}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button onClick={() => handleDelete(c.id)} className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer">Excluir Cartão</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Cadastrar Novo Cartão</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Conta Bancária Vinculada (Obrigatório)</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.bank_name} ({acc.account_type}) - Resp: {acc.person_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Banco Emissor & Estilo</label>
                <select
                  value={selectedBank.id}
                  onChange={(e) => {
                    const found = BANKS_CONFIG.find(b => b.id === e.target.value);
                    if (found) setSelectedBank(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                >
                  {BANKS_CONFIG.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nome Personalizado</label>
                  <input
                    type="text"
                    placeholder="Ex: Nubank Black"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Titular</label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Bandeira</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                  >
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                    <option value="Elo">Elo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Últimos 4 Dígitos</label>
                  <input
                    type="text"
                    maxLength="4"
                    value={lastDigits}
                    onChange={(e) => setLastDigits(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Dia Vencimento</label>
                  <input
                    type="number"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Limite Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                />
              </div>

              <button type="submit" className="bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl mt-2 cursor-pointer shadow-md">
                Salvar Cartão
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}