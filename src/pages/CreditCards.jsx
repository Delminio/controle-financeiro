import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

const BANKS_CONFIG = [
  { id: 'nubank', name: 'Nubank', bg: 'from-purple-700 via-purple-800 to-purple-950', textColor: 'text-white', logo: 'nu', brand: 'mastercard' },
  { id: 'inter', name: 'Inter', bg: 'from-orange-500 via-orange-600 to-amber-700', textColor: 'text-white', logo: 'inter', brand: 'mastercard' },
  { id: 'atacadao', name: 'Atacadão', bg: 'from-emerald-700 via-green-800 to-emerald-950', textColor: 'text-white', logo: 'A', brand: 'visa' },
  { id: 'itau', name: 'Itaúcard', bg: 'from-orange-600 via-amber-600 to-orange-800', textColor: 'text-white', logo: 'Itaú', brand: 'mastercard' },
  { id: 'bradesco', name: 'Bradesco', bg: 'from-red-600 via-red-700 to-red-950', textColor: 'text-white', logo: 'bradesco', brand: 'visa' },
  { id: 'santander', name: 'Santander', bg: 'from-red-700 via-red-800 to-red-950', textColor: 'text-white', logo: 'Santander', brand: 'mastercard' },
  { id: 'bb', name: 'Banco do Brasil', bg: 'from-amber-400 via-yellow-500 to-blue-900', textColor: 'text-blue-950', logo: 'BB', brand: 'visa' },
  { id: 'c6', name: 'C6 Bank', bg: 'from-slate-800 via-zinc-900 to-black', textColor: 'text-white', logo: 'C6BANK', brand: 'mastercard' },
  { id: 'neon', name: 'Neon', bg: 'from-cyan-500 via-sky-600 to-blue-700', textColor: 'text-white', logo: 'neon', brand: 'visa' },
  { id: 'original', name: 'Original', bg: 'from-emerald-600 via-green-700 to-emerald-900', textColor: 'text-white', logo: 'original', brand: 'mastercard' },
  { id: 'pan', name: 'PAN', bg: 'from-sky-500 via-blue-600 to-blue-800', textColor: 'text-white', logo: 'PAN', brand: 'visa' },
  { id: 'cora', name: 'Cora', bg: 'from-teal-400 via-emerald-500 to-teal-700', textColor: 'text-slate-900', logo: 'cora', brand: 'mastercard' },
  { id: 'modalmais', name: 'Modalmais', bg: 'from-blue-800 via-indigo-900 to-slate-950', textColor: 'text-white', logo: 'modalmais', brand: 'visa' },
  { id: 'next', name: 'Banco Next', bg: 'from-emerald-500 via-green-600 to-emerald-800', textColor: 'text-white', logo: 'Next', brand: 'visa' },
  { id: 'credicard', name: 'Credicard', bg: 'from-zinc-900 via-neutral-900 to-black', textColor: 'text-white', logo: 'credicard', brand: 'mastercard' },
  { id: 'bmg', name: 'BMG', bg: 'from-orange-600 via-amber-600 to-orange-900', textColor: 'text-white', logo: 'bmg', brand: 'mastercard' },
  { id: 'will', name: 'Will Bank', bg: 'from-yellow-400 via-amber-400 to-yellow-600', textColor: 'text-slate-950', logo: 'will', brand: 'mastercard' },
  { id: 'digio', name: 'Digio', bg: 'from-sky-400 via-blue-500 to-indigo-700', textColor: 'text-white', logo: 'digio', brand: 'visa' },
  { id: 'porto', name: 'Porto Seguro', bg: 'from-blue-900 via-slate-900 to-black', textColor: 'text-white', logo: 'Porto', brand: 'visa' },
  { id: 'xp', name: 'XP', bg: 'from-zinc-950 via-black to-zinc-900', textColor: 'text-white', logo: 'xp', brand: 'visa' }
];

export default function CreditCards() {
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedBank, setSelectedBank] = useState(BANKS_CONFIG[0]);
  const [cardName, setCardName] = useState('Meu Nubank');
  const [holderName, setHolderName] = useState('Delminio Silva');
  const [accountId, setAccountId] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [lastDigits, setLastDigits] = useState('4321');
  const [dueDay, setDueDay] = useState('10');
  const [darkMode, setDarkMode] = useState(false);
  const [brand, setBrand] = useState('Mastercard');

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

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setCardName(`Meu ${bank.name}`);
    setBrand(bank.brand);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!accountId) return alert('Selecione uma conta bancária vinculada.');
    if (!cardLimit) return alert('Informe o limite do cartão.');

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
          due_day: parseInt(dueDay, 10) || 10,
          color_bg: selectedBank.bg,
          dark_mode: darkMode
        })
      });

      if (res.ok) {
        setCardLimit('');
        alert('Cartão criado e personalizado com sucesso!');
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao cadastrar cartão.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar cartão.');
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
          <h2 className="text-xl font-black text-slate-900">Cartões</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Gerencie seus cartões e personalize o visual em tempo real</p>
        </div>
      </div>

      {/* Grid Principal: Editor de Personalização + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bloco Esquerdo: Formulário & Seletor de Cores */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-lg">💳</span>
            <h3 className="font-extrabold text-slate-800 text-sm">Personalizar e Cadastrar Cartão</h3>
          </div>

          <form onSubmit={handleSaveCard} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Conta Bancária Vinculada (Obrigatório)</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                required
              >
                {accounts.length === 0 ? (
                  <option value="">Nenhuma conta cadastrada (Cadastre na aba Contas)</option>
                ) : (
                  accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.bank_name} - Resp: {acc.person_name}</option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Cartão</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Titular</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Limite (R$)</label>
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
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Últimos 4 Dígitos</label>
                <input
                  type="text"
                  maxLength="4"
                  value={lastDigits}
                  onChange={(e) => setLastDigits(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Vencimento (Dia)</label>
                <input
                  type="number"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Escolha a Cor / Banco do Seu Cartão</label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-1 hide-scrollbar">
                {BANKS_CONFIG.map(bank => (
                  <button
                    type="button"
                    key={bank.id}
                    onClick={() => handleSelectBank(bank)}
                    className={`h-9 rounded-xl bg-gradient-to-br ${bank.bg} border-2 transition cursor-pointer flex items-center justify-center shadow-xs ${selectedBank.id === bank.id ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'}`}
                    title={bank.name}
                  >
                    <span className="text-[9px] font-black text-white truncate px-0.5">{bank.logo}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Aplicar tema escuro no cartão</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={(e) => setDarkMode(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-lg shadow-emerald-200 transition cursor-pointer"
            >
              Salvar e Cadastrar Cartão
            </button>
          </form>
        </div>

        {/* Bloco Direito: Visualização em Tempo Real do Cartão */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Visualização do Seu Cartão</h3>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Em tempo real
              </span>
            </div>

            <div className={`w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br ${darkMode ? 'from-slate-900 via-zinc-900 to-black' : selectedBank.bg} p-6 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-300 border border-white/10 my-4`}>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <span className="text-base font-black tracking-wider uppercase text-white drop-shadow-sm">
                  {selectedBank.name}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white">
                  {cardName}
                </span>
              </div>

              <div className="flex items-center gap-3 relative z-10 my-auto">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-yellow-300 to-amber-100 border border-amber-400/50 flex flex-col justify-between p-1 shadow-xs">
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                </div>
                <span className="text-xs font-mono tracking-widest text-white/90">•••• •••• •••• {lastDigits}</span>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[9px] text-white/70 uppercase tracking-widest font-bold">Titular</p>
                  <p className="text-xs font-extrabold tracking-wide text-white">{holderName}</p>
                </div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-white/90">{brand}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex items-center gap-3 mt-4">
            <span className="text-blue-600 text-lg">💡</span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-800">Dica:</strong> Cada cartão mantém a sua identidade visual personalizada de forma independente.
            </p>
          </div>
        </div>

      </div>

      {/* Lista de Cartões Ativos */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">Cartões Ativos ({cards.length})</h3>
        {cards.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">Nenhum cartão cadastrado no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(c => (
              <div key={c.id} className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">{c.card_name}</span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">{c.bank_emitter}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Titular: {c.holder_name} • Limite: {formatMoney(c.card_limit)}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Vencimento: Dia {c.due_day}</span>
                  <button onClick={() => handleDelete(c.id)} className="text-rose-500 font-bold hover:underline cursor-pointer">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}