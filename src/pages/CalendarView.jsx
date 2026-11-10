import React from 'react';

export default function CalendarView() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Calendário Financeiro</h2>
          <p className="text-xs text-slate-500">Visualização diária de compromissos a pagar, faturas e vencimentos</p>
        </div>
        <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          Novembro / 2026
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">
          <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => (
            <div key={d} className="min-h-[70px] bg-slate-50 border border-slate-100 rounded-xl p-2 flex flex-col justify-between hover:border-emerald-500 transition cursor-pointer">
              <span className="text-xs font-extrabold text-slate-700">{d}</span>
              {d === 5 && <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1 py-0.5 rounded truncate">Fatura R$ 500</span>}
              {d === 10 && <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1 py-0.5 rounded truncate">Aluguel</span>}
              {d === 15 && <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded truncate">Salário</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}