import React from 'react';

export default function Reports() {
  const handleExport = () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';
    window.open(`${API_URL}/export/excel?token=${token}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Relatórios Financeiros</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Geração de relatórios gerenciais consolidados</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
          📊
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 mb-1">Relatório Completo de Movimentações (.XLSX)</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">Baixe todas as suas receitas, despesas, categorias e contas organizadas em formato de planilha profissional.</p>
        </div>
        <button 
          onClick={handleExport}
          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md cursor-pointer transition"
        >
          Baixar Relatório em Excel
        </button>
      </div>
    </div>
  );
}