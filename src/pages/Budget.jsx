import React from 'react';

export default function Budget() {
  const budgets = [
    { category: 'Mercado e Alimentação', limit: 1500, spent: 1250 },
    { category: 'Lazer e Restaurantes', limit: 600, spent: 450 },
    { category: 'Combustível / Transporte', limit: 500, spent: 500 },
    { category: 'Compras Pessoais', limit: 400, spent: 380 }
  ];

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Orçamento Mensal por Categoria</h2>
        <p className="text-xs text-slate-500">Definição de teto máximo de gastos e acompanhamento em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(b => {
          const remaining = b.limit - b.spent;
          const percentage = Math.min(100, Math.round((b.spent / b.limit) * 100));

          return (
            <div key={b.category} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">{b.category}</h3>
                  <span className={`text-xs font-bold ${percentage >= 90 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {percentage}% Utilizado
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                  <div
                    className={`h-full rounded-full transition-all ${percentage >= 100 ? 'bg-rose-600' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-semibold text-slate-500 mt-2">
                  <span>Gasto: {formatMoney(b.spent)}</span>
                  <span>Limite: {formatMoney(b.limit)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] font-bold text-slate-600">
                <span>Restante Disponível:</span>
                <span className={remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}>{formatMoney(remaining)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}