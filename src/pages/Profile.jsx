import React from 'react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg shadow-emerald-200">
        {(user.name || user.email || 'U').substring(0, 1).toUpperCase()}
      </div>
      <h2 className="text-lg font-black text-slate-900">{user.name || 'Utilizador'}</h2>
      <p className="text-xs font-medium text-slate-400 mb-6">{user.email}</p>

      <div className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs space-y-3.5">
        <div className="flex justify-between border-b border-slate-200/60 pb-3">
          <span className="font-bold text-slate-500">Plano Ativo</span>
          <span className="font-extrabold text-emerald-600">SaaS Pessoal Pro</span>
        </div>
        <div className="flex justify-between border-b border-slate-200/60 pb-3">
          <span className="font-bold text-slate-500">Segurança da Conta</span>
          <span className="font-extrabold text-slate-800">Autenticação JWT Ativa</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-slate-500">Isolamento Multi-Tenant</span>
          <span className="font-extrabold text-slate-800">ID #{user.id || 1}</span>
        </div>
      </div>
    </div>
  );
}