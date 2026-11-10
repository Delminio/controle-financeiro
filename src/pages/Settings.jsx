import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';

export default function Settings() {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    try {
      const res = await fetchWithAuth('/people');
      if (res.ok) {
        const json = await res.json();
        setPeople(json);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPerson.trim()) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth('/people', {
        method: 'POST',
        body: JSON.stringify({ name: newPerson.trim() })
      });
      if (res.ok) {
        setNewPerson('');
        fetchPeople();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir esta pessoa?')) return;
    try {
      const res = await fetchWithAuth('/people/' + id, { method: 'DELETE' });
      if (res.ok) {
        fetchPeople();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-800 mb-1">Configurações de Pessoas Responsáveis</h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">Gestão dos membros cadastrados para os lançamentos da casa</p>

        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nome da pessoa (ex: Bernadete, Filho)..."
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
            required
          />
          <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-3 rounded-2xl font-extrabold cursor-pointer transition">
            {loading ? 'Salvando...' : '+ Adicionar'}
          </button>
        </form>

        <div className="divide-y divide-slate-100">
          {people.map((p, index) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{p.name}</span>
              {index === 0 ? (
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  Principal (Padrão)
                </span>
              ) : (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
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