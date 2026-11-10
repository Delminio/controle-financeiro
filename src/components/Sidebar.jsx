import React, { useRef } from 'react';

export default function Sidebar({ activeSection, setActiveSection, user, handleLogout }) {
  const scrollRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Lançamentos', icon: '📋' },
    { id: 'charts', label: 'Gráficos', icon: '📈' },
    { id: 'categories', label: 'Categorias', icon: '🏷️' },
    { id: 'accounts', label: 'Contas Bancárias', icon: '🏦' },
    { id: 'cards', label: 'Cartões', icon: '💳' },
    { id: 'installments', label: 'Parcelas', icon: '🗓️' },
    { id: 'fixed', label: 'Contas Fixas', icon: '🔄' },
    { id: 'calendar', label: 'Calendário', icon: '📅' },
    { id: 'forecast', label: 'Previsão Financeira', icon: '🔮' },
    { id: 'debts', label: 'Empréstimos', icon: '🤝' },
    { id: 'investments', label: 'Investimentos', icon: '💼' },
    { id: 'goals', label: 'Metas', icon: '🎯' },
    { id: 'emergency', label: 'Reserva Financeira', icon: '🛡️' },
    { id: 'budget', label: 'Orçamento', icon: '📊' },
    { id: 'ai', label: 'Assistente IA', icon: '🤖' },
    { id: 'reports', label: 'Relatórios', icon: '📑' },
    { id: 'export', label: 'Exportar', icon: '📥' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'profile', label: 'Meu Perfil', icon: '👤' },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - 250 : scrollLeft + 250,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Cabeçalho Principal Minimalista */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-200">
            📊
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Finanças</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Gestão SaaS Premium</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200/60">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
              {(user?.name || user?.email || 'U').substring(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-extrabold text-slate-800 leading-none">{user?.name || 'Utilizador'}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Usuário Administrador</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
            title="Sair da Conta"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Barra de Navegação Horizontal Deslizante */}
      <div className="max-w-7xl mx-auto px-4 py-2 relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          onMouseEnter={() => scroll('left')}
          className="hidden md:flex items-center justify-center w-8 h-8 bg-white hover:bg-slate-100 text-slate-600 rounded-full shadow-md border border-slate-200 z-10 shrink-0 cursor-pointer"
        >
          ‹
        </button>

        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto hide-scrollbar px-2 py-1 scroll-smooth w-full"
        >
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          onMouseEnter={() => scroll('right')}
          className="hidden md:flex items-center justify-center w-8 h-8 bg-white hover:bg-slate-100 text-slate-600 rounded-full shadow-md border border-slate-200 z-10 shrink-0 cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  );
}