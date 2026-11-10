import React from 'react';

export default function Reports() {
  const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/excel?token=${token}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Relatórios Financeiros</h2>
          <p className="text-xs text-slate-500">Resumo consolidado de despesas, recebimentos e patrimônio</p>
        </div>
        <button onClick={handleDownload} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
          📥 Baixar Relatório em Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xs mb-2">Relatório de Despesas</h3>
          <p className="text-[11px] text-slate-500 mb-4">Detalhamento por categorias, status de pagamento e fornecedores.</p>
          <button onClick={handleDownload} className="text-xs font-bold text-emerald-600 hover:underline">Gerar Relatório →</button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xs mb-2">Relatório de Recebimentos</h3>
          <p className="text-[11px] text-slate-500 mb-4">Origem dos rendimentos, salário e rendas extras.</p>
          <button onClick={handleDownload} className="text-xs font-bold text-emerald-600 hover:underline">Gerar Relatório →</button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xs mb-2">Evolução Patrimonial</h3>
          <p className="text-[11px] text-slate-500 mb-4">Análise acumulada de investimentos e metas atingidas.</p>
          <button onClick={handleDownload} className="text-xs font-bold text-emerald-600 hover:underline">Gerar Relatório →</button>
        </div>
      </div>
    </div>
  );
}