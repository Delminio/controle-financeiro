import React, { useState } from 'react';

const BANKS_CONFIG = [
  { id: 'nubank', name: 'Nubank', bg: 'from-purple-700 via-purple-800 to-purple-950', textColor: 'text-white', logo: 'nu', brand: 'mastercard' },
  { id: 'inter', name: 'Inter', bg: 'from-orange-500 via-orange-600 to-amber-700', textColor: 'text-white', logo: 'inter', brand: 'mastercard' },
  { id: 'atacadao', name: 'Atacadão', bg: 'from-emerald-700 via-green-800 to-emerald-950', textColor: 'text-white', logo: 'A', brand: 'visa' },
  { id: 'itau', name: 'Itaúcard', bg: 'from-orange-600 via-amber-600 to-orange-800', textColor: 'text-white', logo: 'Itaú', brand: 'mastercard' },
  { id: 'bradesco', name: 'Bradesco', bg: 'from-red-600 via-red-700 to-red-950', textColor: 'text-white', logo: 'bradesco', brand: 'visa' },
  { id: 'santander', name: 'Santander', bg: 'from-red-700 via-red-800 to-red-950', textColor: 'text-white', logo: 'Santander', brand: 'mastercard' },
  { id: 'bb', name: 'Banco do Brasil', bg: 'from-amber-400 via-yellow-500 to-blue-900', textColor: 'text-blue-950', logo: 'Banco do Brasil', brand: 'visa' },
  { id: 'c6', name: 'C6 Bank', bg: 'from-slate-800 via-zinc-900 to-black', textColor: 'text-white', logo: 'C6BANK', brand: 'mastercard' },
  { id: 'neon', name: 'Neon', bg: 'from-cyan-500 via-sky-600 to-blue-700', textColor: 'text-white', logo: 'neon', brand: 'visa' },
  { id: 'original', name: 'Original', bg: 'from-emerald-600 via-green-700 to-emerald-900', textColor: 'text-white', logo: 'original', brand: 'mastercard' },
  { id: 'pan', name: 'PAN', bg: 'from-sky-500 via-blue-600 to-blue-800', textColor: 'text-white', logo: 'PAN', brand: 'visa' },
  { id: 'cora', name: 'Cora', bg: 'from-teal-400 via-emerald-500 to-teal-700', textColor: 'text-slate-900', logo: 'cora', brand: 'mastercard' },
  { id: 'modalmais', name: 'Modalmais', bg: 'from-blue-800 via-indigo-900 to-slate-950', textColor: 'text-white', logo: 'modalmais', brand: 'visa' },
  { id: 'next', name: 'Banco Next', bg: 'from-emerald-500 via-green-600 to-emerald-800', textColor: 'text-white', logo: 'Next', brand: 'visa' },
  { id: 'credicard', name: 'Credicard', bg: 'from-zinc-900 via-neutral-900 to-black', textColor: 'text-white', logo: 'credicard', brand: 'mastercard' },
  { id: 'bmg', name: 'BMG', bg: 'from-orange-600 via-amber-600 to-orange-900', textColor: 'text-white', logo: 'bmg', brand: 'mastercard' },
  { id: 'will', name: 'Will Bank', bg: 'from-yellow-400 via-amber-400 to-yellow-600', textColor: 'text-slate-950', logo: 'will bank', brand: 'mastercard' },
  { id: 'digio', name: 'Digio', bg: 'from-sky-400 via-blue-500 to-indigo-700', textColor: 'text-white', logo: 'digio', brand: 'visa' },
  { id: 'porto', name: 'Porto Seguro', bg: 'from-blue-900 via-slate-900 to-black', textColor: 'text-white', logo: 'Porto Seguro', brand: 'visa' },
  { id: 'xp', name: 'XP', bg: 'from-zinc-950 via-black to-zinc-900', textColor: 'text-white', logo: 'xp', brand: 'visa' }
];

export default function CreditCards() {
  const [selectedBank, setSelectedBank] = useState(BANKS_CONFIG[0]);
  const [cardName, setCardName] = useState('Meu Nubank');
  const [holderName, setHolderName] = useState('Delminio Silva');
  const [darkMode, setDarkMode] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: 1, name: 'Meu Nubank', bank: 'Nubank', limit: 5000, used: 1200 }
  ]);

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setCardName(`Meu ${bank.name}`);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      name: cardName,
      bank: selectedBank.name,
      limit: 3000,
      used: 0
    };
    setSavedCards([...savedCards, newCard]);
    alert('Cartão cadastrado e personalizado com sucesso!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho da Aba */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Cartões</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Gerencie seus cartões e personalize o visual do seu cartão</p>
        </div>
        <button 
          onClick={() => alert('Preencha os dados abaixo para adicionar o cartão.')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-emerald-200 transition cursor-pointer flex items-center gap-2"
        >
          <span>+</span> Novo Cartão
        </button>
      </div>

      {/* Grid Principal: Editor de Personalização à Esquerda / Preview à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bloco Esquerdo: Personalizar Cartão */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-lg">💳</span>
            <h3 className="font-extrabold text-slate-800 text-sm">Personalizar Cartão</h3>
          </div>

          <form onSubmit={handleSaveCard} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Banco</label>
                <select
                  value={selectedBank.id}
                  onChange={(e) => {
                    const found = BANKS_CONFIG.find(b => b.id === e.target.value);
                    if (found) handleSelectBank(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {BANKS_CONFIG.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Escolha a Cor do Seu Cartão</label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 max-h-48 overflow-y-auto p-1 hide-scrollbar">
                {BANKS_CONFIG.map(bank => (
                  <button
                    type="button"
                    key={bank.id}
                    onClick={() => handleSelectBank(bank)}
                    className={`h-10 rounded-2xl bg-gradient-to-br ${bank.bg} border-2 transition cursor-pointer flex items-center justify-center shadow-xs ${selectedBank.id === bank.id ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    title={bank.name}
                  >
                    <span className="text-[10px] font-black text-white drop-shadow-xs truncate px-1">{bank.logo}</span>
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
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-lg shadow-emerald-200 transition cursor-pointer"
            >
              Salvar Cartão Personalizado
            </button>
          </form>
        </div>

        {/* Bloco Direito: Visualização em Tempo Real do Cartão */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Visualização do Seu Cartão</h3>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Personalização aplicada!
              </span>
            </div>

            {/* Cartão de Crédito Visual Estilizado (Referência Exata) */}
            <div className={`w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br ${darkMode ? 'from-slate-900 via-zinc-900 to-black' : selectedBank.bg} p-6 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-300 border border-white/10 my-4`}>
              {/* Efeito de brilho de fundo */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <span className={`text-lg font-black tracking-wider uppercase ${selectedBank.textColor}`}>
                  {selectedBank.logo}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md ${selectedBank.textColor}`}>
                  {cardName}
                </span>
              </div>

              <div className="flex items-center gap-3 relative z-10 my-auto">
                {/* Chip do Cartão */}
                <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-yellow-300 to-amber-100 border border-amber-400/50 flex flex-col justify-between p-1 shadow-xs">
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                  <div className="w-full h-[1px] bg-amber-600/40"></div>
                </div>
                {/* Símbolo Contactless */}
                <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 010-7.778M12 20a10 10 0 000-16m4 12a7.5 7.5 0 000-10.607" />
                </svg>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Titular do Cartão</p>
                  <p className={`text-sm font-extrabold tracking-wide ${selectedBank.textColor}`}>{holderName}</p>
                </div>
                {/* Logotipo da Bandeira (Mastercard / Visa) */}
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-red-500/90 mix-blend-screen"></div>
                  <div className="w-7 h-7 rounded-full bg-amber-500/90 mix-blend-screen"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex items-center gap-3 mt-4">
            <span className="text-blue-600 text-lg">💡</span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-800">Dica:</strong> Escolha a cor do seu banco para deixar seu cartão ainda mais personalizado!
            </p>
          </div>
        </div>

      </div>

      {/* Lista de Cartões Cadastrados */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">Cartões Ativos na Conta ({savedCards.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCards.map(c => (
            <div key={c.id} className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900">{c.name}</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">{c.bank}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Limite Total: R$ {c.limit.toFixed(2)}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Fatura Atual: R$ {c.used.toFixed(2)}</span>
                <button onClick={() => setSavedCards(savedCards.filter(item => item.id !== c.id))} className="text-rose-500 font-bold hover:underline cursor-pointer">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}