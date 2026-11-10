import React from 'react';

export default function Charts() {
  const categoryData = [
    { name: 'Alimentação', amount: 1250, color: 'bg-emerald-500', percentage: 35 },
    { name: 'Moradia e Contas', amount: 1100, color: 'bg-blue-500', percentage: 30 },
    { name: 'Transporte', amount: 500, color: 'bg-amber-500', percentage: 14 },
    { name: 'Lazer e Compras', amount: 450, color: 'bg-purple-500', percentage: 13 },
    { name: 'Saúde', amount: 280, color: 'bg-rose-500', percentage: 8 },
  ];

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Gráficos e Análises Financeiras</h2>
          <p className="text-xs text-slate-500">Visualização detalhada da distribuição de gastos e fluxo mensal</p>
        </div>
        <select className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none">
          <option>Mês Atual (Novembro)</option>
          <option>Últimos 3 Meses</option>
          <option>Ano Vigente</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Despesas por Categoria</h3>
          <div className="flex flex-col gap-4">
            {categoryData.map(item => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    <span>{item.name}</span>
                  </div>
                  <span>{formatMoney(item.amount)} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparativo Entradas x Saídas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Entradas vs Saídas (Últimos 4 Meses)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">Agosto</span>
                <span className="font-extrabold text-emerald-600">+ R$ 4.200,00</span>
                <span className="font-extrabold text-rose-600">- R$ 3.100,00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">Setembro</span>
                <span className="font-extrabold text-emerald-600">+ R$ 4.500,00</span>
                <span className="font-extrabold text-rose-600">- R$ 3.800,00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">Outubro</span>
                <span className="font-extrabold text-emerald-600">+ R$ 4.500,00</span>
                <span className="font-extrabold text-rose-600">- R$ 3.400,00</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 mt-4">
            💡 <strong>Insight:</strong> Sua média de poupança mensal nos últimos 3 meses é de aproximadamente 20% da receita.
          </div>
        </div>
      </div>
    </div>
  );
}