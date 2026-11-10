import React, { useState } from 'react';

const DEFAULT_CATEGORIES = {
  income: [
    { name: 'Salário', icon: '💼', color: 'emerald' },
    { name: 'Freelance', icon: '💻', color: 'blue' },
    { name: 'Investimentos', icon: '📈', color: 'purple' },
    { name: 'Rendimentos', icon: '💰', color: 'amber' },
    { name: 'Outras receitas', icon: '🏷️', color: 'slate' }
  ],
  expense: [
    { name: 'Mercado', icon: '🛒', color: 'emerald' },
    { name: 'Alimentação', icon: '🍽️', color: 'rose' },
    { name: 'Moradia', icon: '🏠', color: 'blue' },
    { name: 'Água', icon: '💧', color: 'cyan' },
    { name: 'Energia', icon: '⚡', color: 'amber' },
    { name: 'Gás', icon: '🔥', color: 'orange' },
    { name: 'Internet', icon: '🌐', color: 'indigo' },
    { name: 'Transporte', icon: '🚗', color: 'slate' },
    { name: 'Combustível', icon: '⛽', color: 'red' },
    { name: 'Saúde', icon: '❤️', color: 'rose' },
    { name: 'Educação', icon: '📚', color: 'purple' },
    { name: 'Lazer', icon: '🎉', color: 'pink' },
    { name: 'Cartão de crédito', icon: '💳', color: 'violet' },
    { name: 'Empréstimos', icon: '🤝', color: 'amber' },
    { name: 'Assinaturas', icon: '📱', color: 'blue' },
    { name: 'Outros', icon: '📌', color: 'slate' }
  ]
};

export default function Categories() {
  const [activeTab, setActiveTab] = useState('expense');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newItem = { name: newCatName.trim(), icon: activeTab === 'income' ? '💰' : '🏷️', color: 'emerald' };
    setCategories({
      ...categories,
      [activeTab]: [...categories[activeTab], newItem]
    });
    setNewCatName('');
    setShowModal(false);
  };

  const handleDelete = (type, index) => {
    if (!confirm('Deseja excluir esta categoria?')) return;
    const updated = [...categories[type]];
    updated.splice(index, 1);
    setCategories({ ...categories, [type]: updated });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/85 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Categorias</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Organize suas receitas e despesas de forma limpa e profissional</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-emerald-200 transition cursor-pointer flex items-center gap-2"
        >
          <span>+</span> Nova Categoria
        </button>
      </div>

      {/* Alternador de Tipo */}
      <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200/85 w-fit">
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Despesas ({categories.expense.length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${activeTab === 'income' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Receitas ({categories.income.length})
        </button>
      </div>

      {/* Lista de Categorias em Cartões Minimalistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories[activeTab].map((cat, index) => (
          <div key={index} className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shadow-inner">
                {cat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">0 lançamentos vinculados</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(activeTab, index)} 
              className="text-slate-400 hover:text-rose-600 font-bold text-xs p-2 cursor-pointer transition"
              title="Excluir Categoria"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Modal Nova Categoria */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Nova Categoria de {activeTab === 'expense' ? 'Despesa' : 'Receita'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Assinaturas, Cursos..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-200 transition cursor-pointer">
                Criar Categoria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}