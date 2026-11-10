import React from 'react';

export default function Forecast() {
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const periods = [
    { label: 'Próximos 7 dias', expectedIncome: 0, expectedExpense: 450, forecastBalance: 500 },
    { label: 'Próximos 15 dias', expectedIncome: 1500, expectedExpense: 860, forecastBalance: 1140 },
    { label: 'Próximos 30 dias', expectedIncome: 4500, expectedExpense: 3200, forecastBalance: 2250 },
    { label: 'Próximos 90 dias', expectedIncome: 13500, expectedExpense: 9600, forecastBalance: 4850 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Previsão Financeira e Fluxo de Caixa Futuro</h2>
        <p className="text-xs text-slate-500">Estimativas calculadas com base em contas fixas, parcelamentos ativos e recebimentos previstos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {periods.map(p => (
          <div key={p.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">{p.label}</span>
            <div className="space-y-2 my-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Entradas Previstas:</span>
                <span className="font-bold text-emerald-600">{formatMoney(p.expectedIncome)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Saídas Previstas:</span>
                <span className="font-bold text-rose-600">{formatMoney(p.expectedExpense)}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-2">
              <span className="text-[11px] font-bold text-slate-700">Saldo Estimado:</span>
              <span className="text-sm font-black text-slate-900">{formatMoney(p.forecastBalance)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}