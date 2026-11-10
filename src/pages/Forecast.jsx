import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function Forecast() {
  const [summary, setSummary] = useState({ totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchWithAuth('/transactions');
        if (res.ok) {
          const json = await res.json();
          setSummary(json.summary || { totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 });
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

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Previsão Financeira</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Projeção de saldo futuro calculada a partir dos seus lançamentos reais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Entradas Previstas</span>
          <span className="text-2xl font-black text-emerald-600">{formatMoney(summary.totalReceitas)}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Saídas Previstas</span>
          <span className="text-2xl font-black text-rose-600">{formatMoney(summary.totalDespesas)}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Saldo Projetado</span>
          <span className={`text-2xl font-black ${summary.saldoFinal >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatMoney(summary.saldoFinal)}
          </span>
        </div>
      </div>
    </div>
  );
}