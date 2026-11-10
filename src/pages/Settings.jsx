import React, { useState } from 'react';

export default function Settings() {
  const [people, setPeople] = useState(['Bernadete (Mãe)', 'Filho', 'Família']);
  const [newPerson, setNewPerson] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPerson.trim()) return;
    setPeople([...people, newPerson.trim()]);
    setNewPerson('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-1">Configurações de Pessoas</h2>
        <p className="text-xs text-slate-500 mb-6">Gestão dos membros responsáveis pelos lançamentos da casa</p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Nome da pessoa..."
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none"
            required
          />
          <button type="submit" className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-bold">
            + Adicionar
          </button>
        </form>

        <div className="divide-y divide-slate-100">
          {people.map((p, index) => (
            <div key={p} className="py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{p}</span>
              {index === 0 ? (
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  Fixo Principal (Protegido)
                </span>
              ) : (
                <button
                  onClick={() => setPeople(people.filter((_, i) => i !== index))}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Excluir
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}