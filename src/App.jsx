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

const EXPENSE_CATEGORIES = [
  'Supermercado',
  'Aluguel / Moradia',
  'Transporte / Combustível',
  'Alimentação / Restaurante',
  'Saúde / Farmácia',
  'Educação / Cursos',
  'Lazer / Viagens',
  'Contas Fixas (Luz, Água, Internet)',
  'Assinaturas & Serviços',
  'Vestuário & Acessórios',
  'Manutenção / Veículo',
  'Cuidados Pessoais',
  'Impostos & Taxas',
  'Outras Despesas'
];

const INCOME_CATEGORIES = [
  'Salário Mensal',
  'Rendimento de Investimentos',
  'Prestação de Serviços / Freela',
  'Vendas',
  'Comissões & Bônus',
  'Reembolso',
  'Presentes / Doações',
  'Outras Receitas'
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeTab, setActiveTab] = useState('dashboard');

  // Autenticação
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  // Modais Separados de Despesa e Receita
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  // Estados do Formulário de Despesa
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState('Dinheiro');
  const [expenseCardId, setExpenseCardId] = useState('');
  const [expenseInstallments, setExpenseInstallments] = useState('1');

  // Estados do Formulário de Receita
  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState(INCOME_CATEGORIES[0]);
  const [incomePaymentMethod, setIncomePaymentMethod] = useState('PIX');

  // Dados do Servidor
  const [cardsList, setCardsList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ 
    totalReceitas: 0, 
    totalDespesasDebito: 0, 
    totalDespesasCredito: 0, 
    saldoFinal: 0 
  });

  const loadAppData = async () => {
    if (!token) return;
    try {
      const [transRes, cardRes, accRes] = await Promise.all([
        fetchWithAuth('/transactions'),
        fetchWithAuth('/credit-cards'),
        fetchWithAuth('/bank-accounts')
      ]);

      if (transRes && transRes.ok) {
        const json = await transRes.json();
        setTransactions(json.transactions || []);
        setSummary(json.summary || { totalReceitas: 0, totalDespesasDebito: 0, totalDespesasCredito: 0, saldoFinal: 0 });
      }
      if (cardRes && cardRes.ok) {
        const cardsData = await cardRes.json();
        setCardsList(cardsData);
        if (cardsData.length > 0 && !expenseCardId) {
          setExpenseCardId(cardsData[0].id);
        }
      }
      if (accRes && accRes.ok) setAccountsList(await accRes.json());
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
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

  // LANÇAR DESPESA (-)
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount) return;

    const isCard = expensePaymentMethod === 'Cartão de Crédito';
    const finalCardId = isCard ? (expenseCardId || (cardsList.length > 0 ? cardsList[0].id : null)) : null;

    if (isCard && !finalCardId) {
      alert('Por favor, cadastre um cartão de crédito primeiro na aba Cartões.');
      return;
    }

    try {
      const res = await fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          description: expenseDesc,
          amount: parseFloat(expenseAmount),
          type: 'expense',
          category: expenseCategory,
          account: accountsList.length > 0 ? accountsList[0].bank_name : 'Geral',
          account_id: accountsList.length > 0 ? parseInt(accountsList[0].id, 10) : null,
          card_id: finalCardId ? parseInt(finalCardId, 10) : null,
          payment_method: expensePaymentMethod,
          installment_total: isCard ? parseInt(expenseInstallments, 10) || 1 : 1,
          status: 'Pago'
        })
      });

      if (res.ok) {
        setExpenseDesc('');
        setExpenseAmount('');
        setShowExpenseModal(false);
        loadAppData();
        alert('Despesa lançada com sucesso!');
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao salvar despesa na base de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor.');
    }
  };

  // LANÇAR RECEITA (+)
  const handleCreateIncome = async (e) => {
    e.preventDefault();
    if (!incomeDesc || !incomeAmount) return;

    try {
      const res = await fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          description: incomeDesc,
          amount: parseFloat(incomeAmount),
          type: 'income',
          category: incomeCategory,
          account: accountsList.length > 0 ? accountsList[0].bank_name : 'Geral',
          account_id: accountsList.length > 0 ? parseInt(accountsList[0].id, 10) : null,
          card_id: null,
          payment_method: incomePaymentMethod,
          installment_total: 1,
          status: 'Pago'
        })
      });

      if (res.ok) {
        setIncomeDesc('');
        setIncomeAmount('');
        setShowIncomeModal(false);
        loadAppData();
        alert('Receita lançada com sucesso!');
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao salvar receita na base de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor.');
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

      {/* Navegação por Abas */}
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

      {/* Conteúdo da Aplicação */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Visão Geral</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Resumo financeiro das movimentações</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExportExcel} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xs cursor-pointer">
                  📥 Exportar Excel
                </button>
                <button onClick={() => setShowExpenseModal(true)} className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md cursor-pointer transition">
                  - Lançar Despesa
                </button>
                <button onClick={() => setShowIncomeModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md cursor-pointer transition">
                  + Lançar Receita
                </button>
              </div>
            </div>

            {/* DASHBOARD COM 4 CARDS: SEPARANDO CRÉDITO E DÉBITO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Total de Receitas</span>
                <span className="text-2xl font-black text-emerald-600">{formatMoney(summary.totalReceitas)}</span>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Despesas à Vista (Débito/PIX)</span>
                <span className="text-2xl font-black text-rose-600">{formatMoney(summary.totalDespesasDebito)}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Saldo em Conta (Débito)</span>
                <span className={`text-2xl font-black ${summary.saldoFinal >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{formatMoney(summary.saldoFinal)}</span>
              </div>

              <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200/80 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 block mb-2">Fatura Cartão (Crédito)</span>
                <span className="text-2xl font-black text-purple-700">{formatMoney(summary.totalDespesasCredito)}</span>
                <p className="text-[10px] text-purple-500 font-bold mt-1">NÃO abata do seu saldo em conta</p>
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
                      <span className={`font-black ${t.type === 'income' ? 'text-emerald-600' : t.payment_method === 'Cartão de Crédito' ? 'text-purple-600' : 'text-rose-600'}`}>
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
                <button onClick={handleExportExcel} className="bg-slate-100 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xs cursor-pointer">
                  📥 Exportar Excel
                </button>
                <button onClick={() => setShowExpenseModal(true)} className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md cursor-pointer">
                  - Lançar Despesa
                </button>
                <button onClick={() => setShowIncomeModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md cursor-pointer">
                  + Lançar Receita
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
                        <p className="text-[11px] text-slate-400">{t.category} • {t.payment_method || 'Dinheiro'} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-600' : t.payment_method === 'Cartão de Crédito' ? 'text-purple-600' : 'text-rose-600'}`}>
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

      {/* JANELA 1: LANÇAR DESPESA (-) */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h3 className="font-extrabold text-rose-600 text-sm">Lançar Nova Despesa (-)</h3>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Descrição da Despesa</label>
                <input
                  type="text"
                  placeholder="Ex: Compra Atacadão, Farmácia, Luz"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
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
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Categoria da Despesa</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Forma de Pagamento</label>
                <select
                  value={expensePaymentMethod}
                  onChange={(e) => setExpensePaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Débito">Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {expensePaymentMethod === 'Cartão de Crédito' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Selecionar Cartão de Crédito</label>
                    <select
                      value={expenseCardId}
                      onChange={(e) => setExpenseCardId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                      required
                    >
                      {cardsList.length === 0 ? (
                        <option value="">Nenhum cartão cadastrado (Cadastre na aba Cartões)</option>
                      ) : (
                        cardsList.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.bank_emitter} - {c.card_name} (Limite: R$ {parseFloat(c.card_limit).toFixed(2)})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Número de Parcelas</label>
                    <select
                      value={expenseInstallments}
                      onChange={(e) => setExpenseInstallments(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>{num}x {num === 1 ? '(À vista)' : 'sem juros'}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md cursor-pointer transition">
                Confirmar Despesa (-)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* JANELA 2: LANÇAR RECEITA (+) */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-extrabold text-emerald-600 text-sm">Lançar Nova Receita (+)</h3>
              </div>
              <button onClick={() => setShowIncomeModal(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateIncome} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Descrição da Receita</label>
                <input
                  type="text"
                  placeholder="Ex: Salário, Freelance, Rendimentos"
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
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
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Categoria da Receita</label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  {INCOME_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Forma de Recebimento</label>
                <select
                  value={incomePaymentMethod}
                  onChange={(e) => setIncomePaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência / TED</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md cursor-pointer transition">
                Confirmar Receita (+)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}