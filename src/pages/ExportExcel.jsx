import React from 'react';

export default function ExportExcel() {
  const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/excel?token=${token}`, '_blank');
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-3xl mb-4 border border-emerald-100 shadow-sm">
        📊
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Central de Exportação de Dados (.XLSX)</h2>
      <p className="text-xs text-slate-500 mb-6 max-w-md">
        Baixe o seu relatório financeiro completo formatado em colunas, com moeda nacional em R$, datas brasileiras e pronto para abrir no Excel ou Google Planilhas.
      </p>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left w-full mb-6 text-xs space-y-2 text-slate-600">
        <p className="font-bold text-slate-800">O arquivo exportado contém:</p>
        <p>✓ Histórico completo de receitas e despesas</p>
        <p>✓ Lançamentos categorizados por grupos</p>
        <p>✓ Filtros aplicados no padrão brasileiro (DD/MM/AAAA)</p>
        <p>✓ Valores em moeda nativa e status de pagamento</p>
      </div>

      <button
        onClick={handleDownload}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
      >
        <span>📥</span> Baixar Relatório Excel (.XLSX)
      </button>
    </div>
  );
}