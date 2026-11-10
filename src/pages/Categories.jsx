import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Categories() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const expenseCategories = ['Mercado', 'Alimentação', 'Moradia', 'Água', 'Energia', 'Gás', 'Internet', 'Transporte', 'Combustível', 'Saúde', 'Educação', 'Lazer', 'Cartão de crédito', 'Empréstimos', 'Assinaturas', 'Outros'];
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Rendimentos', 'Outras receitas'];

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

  // Agrupamento para Gráfico de Despesas por Categoria
  const expenseData = expenseCategories.map(cat => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    return { name: cat, valor: total };
  }).filter(item => item.valor > 0);

  // Agrupamento para Gráfico de Receitas por Categoria
  const incomeData = incomeCategories.map(cat => {
    const total = transactions
      .filter(t => t.type === 'income' && t.category === cat)
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    return { name: cat, valor: total };
  }).filter(item => item.valor > 0);

  const currentCategoriesList = activeTab === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Categorias e Análises por Categoria</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Sincronização automática com os lançamentos e gráficos exclusivos</p>
        </div>
      </div>

      <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200/85 w-fit">
        <button
          onClick={() => { setActiveTab('expense'); setSelectedCategory(null); }}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Despesas por Categoria
        </button>
        <button
          onClick={() => { setActiveTab('income'); setSelectedCategory(null); }}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${activeTab === 'income' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Receitas por Categoria
        </button>
      </div>

      {/* Gráficos exclusivos da aba Categorias */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">
          {activeTab === 'expense' ? 'Gráfico: Gastos por Categoria de Despesa' : 'Gráfico: Receitas por Categoria'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeTab === 'expense' ? expenseData : incomeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="valor" fill={activeTab === 'expense' ? '#f43f5e' : '#10b981'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de Categorias clicáveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCategoriesList.map(cat => {
          const catTransactions = transactions.filter(t => t.type === activeTab && t.category === cat);
          const catTotal = catTransactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);

          return (
            <div 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-800">{cat}</h4>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{catTransactions.length} itens</span>
                </div>
                <span className="text-lg font-black text-slate-900">{formatMoney(catTotal)}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                Ver detalhes <span>→</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalhes da Categoria */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Categoria: {selectedCategory}</h3>
                <p className="text-xs text-slate-400">Histórico detalhado de movimentações</p>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.filter(t => t.type === activeTab && t.category === selectedCategory).length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">Nenhum lançamento vinculado a esta categoria.</p>
              ) : (
                transactions.filter(t => t.type === activeTab && t.category === selectedCategory).map(t => (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{t.description}</p>
                      <p className="text-[10px] text-slate-400">{t.account} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`font-extrabold ${activeTab === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {activeTab === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}