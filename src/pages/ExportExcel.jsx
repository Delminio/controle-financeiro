import React from 'react';

export default function ExportExcel() {
  const handleExport = () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';
    window.open(`${API_URL}/export/excel?token=${token}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-black text-slate-900">Exportação de Dados</h2>
        <p className="text-xs text-slate-500 max-w-md">Exporte todos os seus registos financeiros com segurança e total compatibilidade com o Microsoft Excel e Google Sheets.</p>
        <button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md cursor-pointer transition">
          Exportar Dados Agora
        </button>
      </div>
    </div>
  );
}