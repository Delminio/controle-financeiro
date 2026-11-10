import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Charts() {
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

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const chartData = [
    { name: 'Receitas', valor: totalIncome },
    { name: 'Despesas', valor: totalExpense }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gráficos e Análises</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Estatísticas dinâmicas baseadas exclusivamente nas suas movimentações reais</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhum dado financeiro disponível para gerar gráficos.</p>
          <p className="text-[11px] text-slate-400">Cadastre o seu primeiro lançamento na aba Dashboard ou Lançamentos para visualizar as análises.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">Balanço Geral (Receitas vs Despesas)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Bar dataKey="valor" fill="#10b981" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">Resumo Analítico</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Total de Receitas Reais</span>
                  <span className="text-sm font-black text-emerald-600">{formatMoney(totalIncome)}</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800">Total de Despesas Reais</span>
                  <span className="text-sm font-black text-rose-600">{formatMoney(totalExpense)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}