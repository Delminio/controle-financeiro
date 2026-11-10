import React from 'react';

export const BANK_LOGOS = {
  Nubank: (
    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
      nu
    </div>
  ),
  Inter: (
    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
      inter
    </div>
  ),
  Itaú: (
    <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
      Itaú
    </div>
  ),
  'Banco do Brasil': (
    <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-blue-900 flex items-center justify-center font-black text-xs shadow-sm">
      BB
    </div>
  ),
  Bradesco: (
    <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
      brad
    </div>
  ),
  Santander: (
    <div className="w-10 h-10 rounded-2xl bg-red-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
      S
    </div>
  ),
  Caixa: (
    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-orange-400 flex items-center justify-center font-black text-xs shadow-sm">
      CX
    </div>
  ),
  Default: (
    <div className="w-10 h-10 rounded-2xl bg-slate-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
      🏦
    </div>
  )
};

export default function BankLogo({ name }) {
  if (!name) return BANK_LOGOS.Default;
  const matchKey = Object.keys(BANK_LOGOS).find(key => 
    name.toLowerCase().includes(key.toLowerCase())
  );
  return BANK_LOGOS[matchKey] || BANK_LOGOS.Default;
}