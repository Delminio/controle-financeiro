import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from './services/api';
import Sidebar from './components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import CreditCards from './pages/CreditCards';
import Installments from './pages/Installments';
import FixedExpenses from './pages/FixedExpenses';
import CalendarView from './pages/CalendarView';
import Forecast from './pages/Forecast';
import Debts from './pages/Debts';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Budget from './pages/Budget';
import Charts from './pages/Charts';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import ExportExcel from './pages/ExportExcel';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const EXPENSE_CATEGORIES = [
  'Aluguel', 'Condomínio', 'Água', 'Energia elétrica', 'Gás', 'Internet', 'Mercado', 'Padaria',
  'Restaurante', 'Delivery', 'Combustível', 'Uber', 'Manutenção Veículo', 'Cartão de Crédito',
  'Farmácia', 'Plano de Saúde', 'Academia', 'Cursos', 'Cinema', 'Streaming', 'Roupas', 'Outros'
];

const INCOME_CATEGORIES = [
  'Salário', 'Décimo Terceiro', 'Férias', 'Bônus', 'Freelance', 'Venda de Produtos',
  'Renda de Aluguel', 'Dividendos', 'Rendimentos', 'Cashback', 'Outros Recebimentos'
];

const PIE_COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [authMode, setAuthMode] = useState('login');

  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [data, setData] = useState({ summary: { totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 }, transactions: [] });
  const [peopleList, setPeopleList] = useState(['Principal']);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [account, setAccount] = useState('Nubank');
  const [person, setPerson] = useState('Principal');
  const [submitting, setSubmitting] = useState(false);

  const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
    const payload = authMode === 'login' 
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro na autenticação.');

      setToken(json.token);
      setUser(json.user);
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetchWithAuth('/transactions');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPeopleList = async () => {
    if (!token) return;
    try {
      const res = await fetchWithAuth('/people');
      if (res.ok) {
        const json = await res.json();
        const names = json.map(p => p.name);
        setPeopleList(names);
        if (names.length > 0 && !names.includes(person)) {
          setPerson(names[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchPeopleList();
    }
  }, [token, activeSection]);

  useEffect(() => {
    setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [type]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify({ description, amount: parseFloat(amount), type, category, account, person })
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setShowModal(false);
        fetchData();
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao salvar lançamento[cite: 6].');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar lançamento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Deseja apagar este lançamento?')) return;
    try {
      await fetchWithAuth('/transactions/' + id, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/excel?token=${token}`, '_blank');
  };

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const getPieData = () => {
    const expenses = data.transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});
    return Object.keys(grouped).map(cat => ({ name: cat, value: grouped[cat] }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-xl shadow-emerald-200">
              📊
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Finanças SaaS</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Plataforma Profissional de Gestão Financeira</p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-bold mb-5">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-600 transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-600 transition"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-200 transition mt-2 cursor-pointer"
            >
              {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              {authMode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pieData = getPieData();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={user} 
        handleLogout={handleLogout} 
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 capitalize">{activeSection}</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Visão geral e controle completo das suas finanças</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportExcel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-200 transition cursor-pointer flex items-center gap-2"
            >
              <span>📥</span> Exportar Excel
            </button>
            <button 
              onClick={() => { fetchPeopleList(); setShowModal(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-emerald-200 transition cursor-pointer flex items-center gap-2"
            >
              <span>+</span> Novo Lançamento
            </button>
          </div>
        </div>

        {activeSection === 'dashboard' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100 block mb-1">Receita do Mês</span>
                  <span className="text-3xl font-black tracking-tight">{formatMoney(data.summary.totalReceitas)}</span>
                </div>
                <button 
                  onClick={() => { setType('income'); fetchPeopleList(); setShowModal(true); }}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer w-fit"
                >
                  + Adicionar Receita
                </button>
              </div>

              <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-100 block mb-1">Despesas do Mês</span>
                  <span className="text-3xl font-black tracking-tight">{formatMoney(data.summary.totalDespesas)}</span>
                </div>
                <button 
                  onClick={() => { setType('expense'); fetchPeopleList(); setShowModal(true); }}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer w-fit"
                >
                  + Lançar Despesa
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block mb-1">Saldo Atual</span>
                  <span className="text-3xl font-black tracking-tight">{formatMoney(data.summary.saldoFinal)}</span>
                </div>
                <span className="mt-4 text-[11px] text-emerald-400 font-bold">✓ Contas atualizadas em tempo real</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm mb-4 pb-3 border-b border-slate-100">Gráfico de Pizza: Despesas por Categoria</h3>
                {pieData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs font-medium">
                    <span>Nenhuma despesa cadastrada para exibir no gráfico.</span>
                    <button onClick={() => { fetchPeopleList(); setShowModal(true); }} className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer">
                      + Cadastrar Despesa
                    </button>
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatMoney(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800 text-sm">Últimas Movimentações</h3>
                    <span className="text-xs font-bold text-slate-400">{data.transactions.length} lançamentos</span>
                  </div>

                  {data.transactions.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-xs text-slate-400 font-medium mb-3">Nenhum lançamento registrado.</p>
                      <button onClick={() => { fetchPeopleList(); setShowModal(true); }} className="bg-emerald-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer">
                        + Cadastrar Lançamento
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {data.transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {t.type === 'income' ? '+' : '-'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{t.description}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{t.category} • {t.account} • Resp: {t.person}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-extrabold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                            </span>
                            <button onClick={() => handleDeleteTransaction(t.id)} className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer">Apagar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'transactions' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-800 mb-6 pb-3 border-b border-slate-100">Todos os Lançamentos ({data.transactions.length})</h2>
            {data.transactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center font-medium">Nenhum lançamento cadastrado.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.transactions.map(t => (
                  <div key={t.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{t.description}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{t.category} • {t.account} • Resp: {t.person} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-extrabold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                      </span>
                      <button onClick={() => handleDeleteTransaction(t.id)} className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer">Apagar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'charts' && <Charts />}
        {activeSection === 'categories' && <Categories />}
        {activeSection === 'accounts' && <Accounts />}
        {activeSection === 'cards' && <CreditCards />}
        {activeSection === 'installments' && <Installments />}
        {activeSection === 'fixed' && <FixedExpenses />}
        {activeSection === 'calendar' && <CalendarView />}
        {activeSection === 'forecast' && <Forecast />}
        {activeSection === 'debts' && <Debts />}
        {activeSection === 'investments' && <Investments />}
        {activeSection === 'goals' && <Goals />}
        {activeSection === 'emergency' && <Investments />}
        {activeSection === 'budget' && <Budget />}
        {activeSection === 'ai' && <AIAssistant />}
        {activeSection === 'reports' && <Reports />}
        {activeSection === 'export' && <ExportExcel />}
        {activeSection === 'settings' && <Settings />}
        {activeSection === 'profile' && <Profile />}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Novo Lançamento</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Mercado, Luz, Salário"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Pessoa Responsável</label>
                  <select
                    value={person}
                    onChange={(e) => setPerson(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {peopleList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-1">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${type === 'expense' ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-slate-100 text-slate-600'}`}
                >
                  Despesa (-)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${type === 'income' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-600'}`}
                >
                  Receita (+)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Conta / Carteira</label>
                <select 
                  value={account} 
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="Nubank">Nubank</option>
                  <option value="Inter">Inter</option>
                  <option value="Carteira">Carteira (Dinheiro)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-200 transition mt-2 cursor-pointer"
              >
                {submitting ? 'Salvando...' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}