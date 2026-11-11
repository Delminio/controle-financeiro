import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
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

  // Modais de Lançamento
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  // Estados Formulário Despesa
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState('Dinheiro');
  const [expenseCardId, setExpenseCardId] = useState('');
  const [expenseInstallments, setExpenseInstallments] = useState('1');

  // Estados Formulário Receita
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
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao salvar despesa na base de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor.');
    }
  };

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
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao salvar receita na base de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Tem certeza de que deseja apagar este lançamento?')) return;

    try {
      const res = await fetchWithAuth(`/transactions/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadAppData();
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erro ao apagar lançamento.');
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
      <div className="min-h-screen bg-[#0e1220] flex items-center justify-center p-4">
        <div className="bg-[#151b2e] w-full max-w-md rounded-xl p-8 border border-[#252c45] shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2f55d4] text-white text-xl flex items-center justify-center mx-auto mb-2 font-black">
              F
            </div>
            <h1 className="text-xl font-bold text-white">Finanças</h1>
            <p className="text-xs text-[#8f97b3] mt-0.5">Gestão Financeira Comercial & Pessoal</p>
          </div>

          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-lg mb-4 text-center font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-3">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#8f97b3] mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0e1220] border border-[#252c45] text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2f55d4]"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#8f97b3] mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1220] border border-[#252c45] text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2f55d4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8f97b3] mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e1220] border border-[#252c45] text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2f55d4]"
                required
              />
            </div>

            <button type="submit" className="mt-2 bg-[#2f55d4] hover:bg-[#2546b3] text-white font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-[#8f97b3] hover:text-white cursor-pointer">
              {isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {/* 1. DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowIncomeModal(true)} className="bg-[#0f9d6b] hover:opacity-90 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition">
                + Lançar Receita
              </button>
              <button onClick={() => setShowExpenseModal(true)} className="bg-[#d64550] hover:opacity-90 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition">
                − Lançar Despesa
              </button>
              <button onClick={handleExportExcel} className="border border-[#e3e6ee] dark:border-[#252c45] bg-white dark:bg-[#151b2e] text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition">
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Cards KPI Estilo HTML */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4">
              <small className="block text-xs text-[#667085] dark:text-[#8f97b3] font-medium mb-1">Receitas do Mês</small>
              <div className="flex items-baseline gap-1.5">
                <b className="text-2xl font-bold tracking-tight">{formatMoney(summary.totalReceitas)}</b>
                <i className="not-italic text-xs font-semibold text-[#0f9d6b]">+12%</i>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4">
              <small className="block text-xs text-[#667085] dark:text-[#8f97b3] font-medium mb-1">Despesas (Débito/PIX)</small>
              <div className="flex items-baseline gap-1.5">
                <b className="text-2xl font-bold tracking-tight">{formatMoney(summary.totalDespesasDebito)}</b>
                <i className="not-italic text-xs font-semibold text-[#d64550]">-4%</i>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4">
              <small className="block text-xs text-[#667085] dark:text-[#8f97b3] font-medium mb-1">Saldo Atual</small>
              <div className="flex items-baseline gap-1.5">
                <b className={`text-2xl font-bold tracking-tight ${summary.saldoFinal >= 0 ? 'text-[#0f9d6b]' : 'text-[#d64550]'}`}>
                  {formatMoney(summary.saldoFinal)}
                </b>
                <i className="not-italic text-xs font-semibold text-[#0f9d6b]">+8%</i>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4">
              <small className="block text-xs text-[#667085] dark:text-[#8f97b3] font-medium mb-1">Fatura do Cartão</small>
              <div className="flex items-baseline gap-1.5">
                <b className="text-2xl font-bold tracking-tight text-[#7a5af8]">{formatMoney(summary.totalDespesasCredito)}</b>
                <i className="not-italic text-xs font-semibold text-[#667085]">Fatura</i>
              </div>
            </div>
          </div>

          {/* Lista de Movimentações */}
          <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Últimas Movimentações</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-[#667085] dark:text-[#8f97b3] text-center py-6">Nenhum lançamento registrado.</p>
            ) : (
              <div className="divide-y divide-[#e3e6ee] dark:divide-[#252c45]">
                {transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#161b2e] dark:text-slate-100">{t.description}</p>
                      <p className="text-[11px] text-[#667085] dark:text-[#8f97b3]">{t.category} • {t.payment_method || 'Dinheiro'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${t.type === 'income' ? 'text-[#0f9d6b]' : t.payment_method === 'Cartão de Crédito' ? 'text-[#7a5af8]' : 'text-[#d64550]'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="text-[#667085] hover:text-[#d64550] p-1 transition cursor-pointer"
                        title="Apagar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LANÇAMENTOS */}
      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold tracking-tight">Lançamentos</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowIncomeModal(true)} className="bg-[#0f9d6b] text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer">
                + Novo Lançamento
              </button>
              <button onClick={handleExportExcel} className="border border-[#e3e6ee] dark:border-[#252c45] bg-white dark:bg-[#151b2e] text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151b2e] border border-[#e3e6ee] dark:border-[#252c45] rounded-lg p-4 overflow-x-auto">
            {transactions.length === 0 ? (
              <p className="text-xs text-[#667085] dark:text-[#8f97b3] text-center py-6">Nenhum lançamento encontrado.</p>
            ) : (
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e3e6ee] dark:border-[#252c45] text-[11px] text-[#667085] dark:text-[#8f97b3]">
                    <th className="pb-2 font-semibold">Data</th>
                    <th className="pb-2 font-semibold">Descrição</th>
                    <th className="pb-2 font-semibold">Categoria</th>
                    <th className="pb-2 font-semibold">Forma</th>
                    <th className="pb-2 font-semibold">Valor</th>
                    <th className="pb-2 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e6ee] dark:divide-[#252c45] text-xs">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-[#f1f3f8] dark:hover:bg-[#1c2339] transition">
                      <td className="py-2.5">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-2.5 font-semibold">{t.description}</td>
                      <td className="py-2.5 text-[#667085] dark:text-[#8f97b3]">{t.category}</td>
                      <td className="py-2.5">{t.payment_method || 'Dinheiro'}</td>
                      <td className={`py-2.5 font-bold ${t.type === 'income' ? 'text-[#0f9d6b]' : t.payment_method === 'Cartão de Crédito' ? 'text-[#7a5af8]' : 'text-[#d64550]'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="px-2 py-1 border border-[#e3e6ee] dark:border-[#252c45] text-[#d64550] rounded-md text-[11px] font-semibold hover:bg-rose-50 transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* DEMAIS ABAS */}
      {activeTab === 'categories' && <Categories />}
      {activeTab === 'accounts' && <Accounts />}
      {activeTab === 'cards' && <CreditCards />}
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
      {activeTab === 'settings' && <Settings />}

      {/* MODAL DESPESA */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#151b2e] w-full max-w-sm rounded-xl p-5 border border-[#e3e6ee] dark:border-[#252c45] shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e3e6ee] dark:border-[#252c45] pb-2">
              <h3 className="font-bold text-[#d64550] text-sm">Lançar Despesa (-)</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-[#667085] font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Mercado, Luz, Farmácia"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Categoria</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Forma de Pagamento</label>
                <select
                  value={expensePaymentMethod}
                  onChange={(e) => setExpensePaymentMethod(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
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
                    <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Cartão de Crédito</label>
                    <select
                      value={expenseCardId}
                      onChange={(e) => setExpenseCardId(e.target.value)}
                      className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
                      required
                    >
                      {cardsList.length === 0 ? (
                        <option value="">Nenhum cartão cadastrado</option>
                      ) : (
                        cardsList.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.bank_emitter} - {c.card_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Parcelas</label>
                    <select
                      value={expenseInstallments}
                      onChange={(e) => setExpenseInstallments(e.target.value)}
                      className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>{num}x {num === 1 ? '(À vista)' : 'sem juros'}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="mt-2 bg-[#d64550] text-white font-semibold py-2 rounded-md transition cursor-pointer">
                Confirmar Despesa (-)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RECEITA */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#151b2e] w-full max-w-sm rounded-xl p-5 border border-[#e3e6ee] dark:border-[#252c45] shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#e3e6ee] dark:border-[#252c45] pb-2">
              <h3 className="font-bold text-[#0f9d6b] text-sm">Lançar Receita (+)</h3>
              <button onClick={() => setShowIncomeModal(false)} className="text-[#667085] font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCreateIncome} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Salário, Freelance"
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Categoria</label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
                >
                  {INCOME_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#667085] dark:text-[#8f97b3] mb-1">Forma de Recebimento</label>
                <select
                  value={incomePaymentMethod}
                  onChange={(e) => setIncomePaymentMethod(e.target.value)}
                  className="w-full bg-white dark:bg-[#0e1220] border border-[#e3e6ee] dark:border-[#252c45] rounded-md px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência / TED</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <button type="submit" className="mt-2 bg-[#0f9d6b] text-white font-semibold py-2 rounded-md transition cursor-pointer">
                Confirmar Receita (+)
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}