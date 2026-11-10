import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [eventType, setEventType] = useState('financeiro');
  const [description, setDescription] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetchWithAuth('/calendar-events');
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDayDoubleClick = (day) => {
    const formattedDate = `2026-11-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(formattedDate);
    setShowModal(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !selectedDateStr) return;

    try {
      const res = await fetchWithAuth('/calendar-events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          event_type: eventType,
          amount: parseFloat(amount) || 0,
          event_date: selectedDateStr,
          status: 'Pendente'
        })
      });

      if (res.ok) {
        setTitle('');
        setAmount('');
        setDescription('');
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este evento?')) return;
    try {
      await fetchWithAuth('/calendar-events/' + id, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Calendário Financeiro</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Dê duplo clique em qualquer dia para adicionar um compromisso ou movimentação</p>
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
          {days.map(d => {
            const dateStr = `2026-11-${String(d).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.event_date && e.event_date.startsWith(dateStr));

            return (
              <div 
                key={d} 
                onDoubleClick={() => handleDayDoubleClick(d)}
                className="min-h-[100px] bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between hover:border-emerald-500 transition cursor-pointer select-none"
                title="Dê duplo clique para adicionar evento"
              >
                <span className="text-xs font-black text-slate-700">{d}</span>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-16">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between ${ev.event_type === 'recebimento' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      <span className="truncate">{ev.title}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} className="hover:text-red-900 ml-1">×</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Adicionar Evento em {selectedDateStr}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                >
                  <option value="divida">Dívida / Despesa</option>
                  <option value="recebimento">Recebimento</option>
                  <option value="financeiro">Evento Financeiro / Lembrete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Ex: Pagar Aluguel, Receber Cliente"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Observações</label>
                <textarea
                  placeholder="Detalhes adicionais..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold"
                />
              </div>

              <button type="submit" className="bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl mt-2 cursor-pointer shadow-md">
                Salvar Evento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}