import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function Installments() {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchWithAuth('/transactions');
        if (res.ok) {
          const json = await res.json();
          // Filtra transações que representam compras parceladas ou exibe lista vazia real
          const realInstallments = (json.transactions || []).filter(t => t.description.toLowerCase().includes('parcela') || t.category === 'Cartão de crédito');
          setInstallments(realInstallments);
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
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Parcelas</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Acompanhamento de compras parceladas vinculadas a registros reais</p>
        </div>
      </div>

      {installments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs text-slate-400 font-semibold mb-2">Nenhuma compra parcelada encontrada.</p>
          <p className="text-[11px] text-slate-400">As parcelas aparecerão automaticamente conforme você registrar transações parceladas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {installments.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xs font-extrabold text-slate-800">{item.description}</h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">{item.account}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-4">
                  <span>Valor: <strong className="text-slate-900">{formatMoney(item.amount)}</strong></span>
                  <span>Vencimento: {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}