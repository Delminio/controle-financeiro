import React, { useState, useEffect } from 'react';
import Accounts from './pages/Accounts';
import AIAssistant from './pages/AIAssistant';
import Budget from './pages/Budget';
import CalendarView from './pages/CalendarView';
import Categories from './pages/Categories';
import Charts from './pages/Charts';
import CreditCards from './pages/CreditCards';
import Debts from './pages/Debts';
import Emergency from './pages/Emergency';
import ExportExcel from './pages/ExportExcel';
import FixedExpenses from './pages/FixedExpenses';
import Forecast from './pages/Forecast';
import Goals from './pages/Goals';
import Installments from './pages/Installments';
import Investments from './pages/Investments';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import { fetchWithAuth } from './services/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados de Autenticação / Login
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  // Estados do Modal de Novo Lançamento Global
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transType, setTransType] = useState('expense');
  const [category, setCategory] = useState('Mercado');
  const [account, setAccount] = useState('Nubank');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [cardId, setCardId] = useState('');
  const [cardsList, setCardsList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 });

  const loadAppData = async () => {
    if (!token) return;
    try {
      const [transRes, cardRes, accRes] = await Promise.all([
        fetchWithAuth('/transactions'),
        fetchWithAuth('/credit-cards'),
        fetchWithAuth('/bank-accounts')
      ]);
      if (transRes.ok) {
        const json = await transRes.json();
        setTransactions(json.transactions || []);
        setSummary(json.summary || { totalReceitas: 0, totalDespesas: 0, saldoFinal: 0 });
      }
      if (cardRes.ok) setCardsList(await cardRes.json());
      if (accRes.ok) setAccountsList(await accRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      loadAppData();
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const API_URL = 'https://controle-financeiro-x8ah.onrender.com/api';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na autenticação');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser({});
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      const res = await fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          type: transType,
          category,
          account: accountsList.length > 0 ? accountsList[0].bank_name : 'Nubank',
          account_id: accountsList.length > 0 ? accountsList[0].id : null,
          card_id: paymentMethod === 'Cartão de Crédito' && cardId ? parseInt(cardId, 10) : null,
          payment_method: paymentMethod,
          status: 'Pago'
        })
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setShowTransactionModal(false);
        loadAppData();
        alert('Lançamento efetuado com sucesso!');
      } else {
        alert('Erro ao salvar lançamento.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    window.open(`https://controle-financeiro-x8ah.onrender.com/api/export/excel?token=${token}`, '_blank');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900">Organize Financeiro</h1>
            <p className="text-xs text-slate-500 mt-1">Gestão SaaS Comercial e Pessoal</p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-2xl mb-4 text-center font-bold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium"
                required
              />
            </div>

            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-200 transition cursor-pointer">
              {isLogin ? 'Entrar na Conta' : 'Criar Conta Gratuita'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              {isLogin ? 'Não tem conta? Registe-se aqui' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Topo / Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-md">
            💰
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-none">Finanças</h1>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Gestão SaaS Premium</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-black text-slate-800">{user.name || 'Utilizador'}</span>
            <span className="text-[10px] text-slate-400 font-medium">Administrador</span>
          </div>
          <button onClick={handleLogout} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer">
            Sair
          </button>
        </div>
      </header>

      {/* Menu de Abas */}
      <nav className="bg-white border-b border-slate-200/60 px-6 py-3 flex gap-2 overflow-x-auto hide-scrollbar shadow-xs">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'transactions', label: '📝 Lançamentos' },
          { id: 'accounts', label: '🏦 Contas Bancárias' },
          { id: 'cards', label: '💳 Cartões' },
          { id: 'categories', label: '🏷️ Categorias' },
          { id: 'calendar', label: '📅 Calendário' },
          { id: 'charts', label: '📈 Gráficos' },
          { id: 'budget', label: '🎯 Orçamento' },
          { id: 'goals', label: '🏆 Metas' },
          { id: 'debts', label: '🤝 Empréstimos' },
          { id: 'investments', label: '📊 Investimentos' },
          { id: 'emergency', label: '🛡️ Reserva' },
          { id: 'installments', label: '⏱️ Parcelas' },
          { id: 'fixed', label: '🔄 Contas Fixas' },
          { id: 'forecast', label: '🔮 Previsão' },
          { id: 'ai', label: '🤖 Assistente IA' },
          { id: 'reports', label: '📑 Relatórios' },
          { id: 'profile', label: '👤 Perfil' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Visão Geral</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Resumo financeiro das suas contas e movimentações reais</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExportExcel} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-xs transition cursor-pointer">
                  📥 Exportar Excel
                </button>
                <button onClick={() => setShowTransactionModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer transition">
                  + Novo Lançamento
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Total de Receitas</span>
                <span className="text-2xl font-black text-emerald-600">{formatMoney(summary.totalReceitas)}</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Total de Despesas</span>
                <span className="text-2xl font-black text-rose-600">{formatMoney(summary.totalDespesas)}</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Saldo Consolidado</span>
                <span className={`text-2xl font-black ${summary.saldoFinal >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{formatMoney(summary.saldoFinal)}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-sm mb-4">Últimas Movimentações</h3>
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Nenhum lançamento registrado.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{t.description}</p>
                        <p className="text-[10px] text-slate-400">{t.category} • {t.payment_method || 'Dinheiro'}</p>
                      </div>
                      <span className={`font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Lançamentos</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Histórico completo de receitas e despesas</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExportExcel} className="bg-slate-100 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-xs cursor-pointer">
                  📥 Exportar Excel
                </button>
                <button onClick={() => setShowTransactionModal(true)} className="bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer">
                  + Novo Lançamento
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Nenhum lançamento encontrado.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <div key={t.id} className="py-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-black text-slate-800 text-sm">{t.description}</p>
                        <p className="text-[11px] text-slate-400">{t.category} • {t.account} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'accounts' && <Accounts />}
        {activeTab === 'cards' && <CreditCards />}
        {activeTab === 'categories' && <Categories />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'charts' && <Charts />}
        {activeTab === 'budget' && <Budget />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'debts' && <Debts />}
        {activeTab === 'investments' && <Investments />}
        {activeTab === 'emergency' && <Emergency />}
        {activeTab === 'installments' && <Installments />}
        {activeTab === 'fixed' && <FixedExpenses />}
        {activeTab === 'forecast' && <Forecast />}
        {activeTab === 'ai' && <AIAssistant />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Modal Global de Novo Lançamento (Com suporte a Cartão de Crédito) */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Novo Lançamento</h3>
              <button onClick={() => setShowTransactionModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateTransaction} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Supermercado, Salário"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTransType('expense')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${transType === 'expense' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Despesa (-)
                </button>
                <button
                  type="button"
                  onClick={() => setTransType('income')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${transType === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Receita (+)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Débito">Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {paymentMethod === 'Cartão de Crédito' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Selecionar Cartão</label>
                  <select
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                    required
                  >
                    <option value="">Selecione o cartão...</option>
                    {cardsList.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.bank_emitter} - {c.card_name} (Limite: R$ {parseFloat(c.card_limit).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="mt-2 bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md cursor-pointer">
                Confirmar Lançamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}