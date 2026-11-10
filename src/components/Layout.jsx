import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'transactions', label: 'Lançamentos', icon: '📝' },
  { id: 'categories', label: 'Categorias', icon: '🏷️' },
  { id: 'accounts', label: 'Contas Bancárias', icon: '🏦' },
  { id: 'cards', label: 'Cartões', icon: '💳' },
  { id: 'calendar', label: 'Calendário', icon: '📅' },
  { id: 'charts', label: 'Gráficos', icon: '📈' },
  { id: 'budget', label: 'Orçamento', icon: '🎯' },
  { id: 'goals', label: 'Metas', icon: '🏆' },
  { id: 'debts', label: 'Empréstimos', icon: '🤝' },
  { id: 'investments', label: 'Investimentos', icon: '📊' },
  { id: 'emergency', label: 'Reserva Financeira', icon: '🛡️' },
  { id: 'installments', label: 'Parcelas', icon: '⏱️' },
  { id: 'fixed', label: 'Contas Fixas', icon: '🔄' },
  { id: 'forecast', label: 'Previsão Financeira', icon: '🔮' },
  { id: 'ai', label: 'Assistente IA', icon: '🤖' },
  { id: 'reports', label: 'Relatórios', icon: '📑' },
  { id: 'profile', label: 'Meu Perfil', icon: '👤' }
];

export default function Layout({ children, activeTab, setActiveTab, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans transition-colors duration-200`}>
      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Lateral */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Topo da Sidebar / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              💎
            </div>
            {!collapsed && (
              <span className="font-black text-slate-900 dark:text-white text-base tracking-tight whitespace-nowrap">
                Finanças <span className="text-xs text-indigo-600 font-extrabold uppercase">SaaS</span>
              </span>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {collapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 hide-scrollbar">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar: Modo Escuro e Perfil */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {!collapsed && <span>Modo {darkMode ? 'Claro' : 'Escuro'}</span>}
            <span>{darkMode ? '☀️' : '🌙'}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
          >
            <span>🚪</span>
            {!collapsed && <span>Sair da conta</span>}
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal + Barra Superior */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Barra Superior Header */}
        <header className={`h-16 ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'} border-b backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600"
            >
              ☰
            </button>
            <div className="relative hidden sm:block w-64">
              <input
                type="text"
                placeholder="Pesquisar movimentações..."
                className={`w-full ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'} text-xs rounded-xl pl-9 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight">{user.name || 'Utilizador'}</span>
                <span className="text-[10px] text-slate-400 font-semibold">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* View da Página Ativa */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}