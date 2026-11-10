import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from './services/api';
import Sidebar from './components/Sidebar';
import Categories from './pages/Categories';
import CreditCards from './pages/CreditCards';
import Installments from './pages/Installments';
import Investments from './pages/Investments';
import Debts from './pages/Debts';
import Goals from './pages/Goals';
import Charts from './pages/Charts';
import Forecast from './pages/Forecast';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import ExportExcel from './pages/ExportExcel';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [account, setAccount] = useState('Nubank');
  const [person, setPerson] = useState('Bernadete');
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

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify({ description, amount: parseFloat(amount), type, account, person })
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
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

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-lg shadow-emerald-200">
              O
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Organize Financeiro</h1>
            <p className="text-xs text-slate-500 mt-1">Plataforma de Gestão Financeira Pessoal</p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">E-mail</label>
              <input 
                type="email" 
                placeholder="bernadete@financeiro.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-200 transition mt-2"
            >
              {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              {authMode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        user={user} 
        handleLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 font-bold text-xl">☰</button>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {activeSection}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportExcel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 transition"
            >
              📥 Exportar Excel
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-100 transition"
            >
              + Novo Lançamento
            </button>
          </div>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto">
          {activeSection === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Receitas do Mês</span>
                  <span className="text-2xl font-extrabold text-emerald-600">{formatMoney(data.summary.totalReceitas)}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Despesas do Mês</span>
                  <span className="text-2xl font-extrabold text-rose-600">{formatMoney(data.summary.totalDespesas)}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Saldo Atual</span>
                  <span className={'text-2xl font-extrabold ' + (data.summary.saldoFinal >= 0 ? 'text-slate-900' : 'text-rose-600')}>
                    {formatMoney(data.summary.saldoFinal)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">Últimas Movimentações</h3>
                  <span className="text-xs text-slate-400">{data.transactions.length} lançamentos</span>
                </div>

                {data.transactions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">Nenhuma movimentação registrada.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {data.transactions.map(t => (
                      <div key={t.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={'w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ' + (t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                            {t.type === 'income' ? '+' : '-'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{t.description}</p>
                            <p className="text-[10px] text-slate-400">{t.person} • {t.account}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={'text-xs font-bold ' + (t.type === 'income' ? 'text-emerald-600' : 'text-slate-700')}>
                            {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                          </span>
                          <button onClick={() => handleDeleteTransaction(t.id)} className="text-[11px] text-rose-500 font-bold hover:underline">Apagar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'categories' && <Categories />}
          {activeSection === 'cards' && <CreditCards />}
          {activeSection === 'installments' && <Installments />}
          {activeSection === 'investments' && <Investments />}
          {activeSection === 'debts' && <Debts />}
          {activeSection === 'goals' && <Goals />}
          {activeSection === 'charts' && <Charts />}
          {activeSection === 'forecast' && <Forecast />}
          {activeSection === 'ai' && <AIAssistant />}
          {activeSection === 'reports' && <Reports />}
          {activeSection === 'export' && <ExportExcel />}

          {!['dashboard', 'categories', 'cards', 'installments', 'investments', 'debts', 'goals', 'charts', 'forecast', 'ai', 'reports', 'export'].includes(activeSection) && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center py-16">
              <span className="text-4xl block mb-3">🛠️</span>
              <h3 className="font-bold text-slate-800 text-base mb-1">Módulo {activeSection}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Módulo isolado pronto para personalização em arquivo separado.
              </p>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Novo Lançamento</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddTransaction} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Mercado, Luz, Salário"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Pessoa Responsável</label>
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => setPerson(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Conta / Carteira</label>
                <select 
                  value={account} 
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  <option value="Nubank">Nubank</option>
                  <option value="Inter">Inter</option>
                  <option value="Carteira">Carteira (Dinheiro)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 my-1">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={'py-2 rounded-xl text-xs font-bold transition ' + (type === 'expense' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600')}
                >
                  Despesa (-)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={'py-2 rounded-xl text-xs font-bold transition ' + (type === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600')}
                >
                  Receita (+)
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-200 transition"
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