import React, { useState } from 'react';

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Calendário Financeiro</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Visualize vencimentos e compromissos diários</p>
        </div>
        <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl border border-slate-200">
          Novembro / 2026
        </span>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-4 border-b border-slate-100 pb-3">
          <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
        </div>
        <div className="grid grid-cols-7 gap-2.5">
          {days.map(d => (
            <div 
              key={d} 
              onClick={() => setSelectedDate(d)}
              className="min-h-[85px] bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between hover:border-emerald-500 transition cursor-pointer"
            >
              <span className="text-xs font-black text-slate-700">{d}</span>
              <span className="text-[10px] text-slate-400 font-medium">Sem eventos</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}