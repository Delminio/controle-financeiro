import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function Budget() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchWithAuth('/transactions');
        if (res.ok) {
          const json = await res.json();
          setTransactions(json.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const expenses = transactions.filter(t => t.type === 'expense');
  const groupedExpenses = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const categoriesList = Object.keys(groupedExpenses);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Orçamento Mensal por Categoria</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Acompanhamento de gastos reais consolidados por categoria</p>
      </div>

      {categoriesList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhum gasto registrado para compor o orçamento.</p>
          <p className="text-[11px] text-slate-400">Cadastre despesas para visualizar o uso real do seu orçamento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoriesList.map(cat => {
            const spent = groupedExpenses[cat];
            return (
              <div key={cat} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-extrabold text-slate-800">{cat}</h4>
                    <span className="text-xs font-bold text-slate-600">Gasto Atual</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Total Utilizado:</span>
                    <strong className="text-rose-600">{formatMoney(spent)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}