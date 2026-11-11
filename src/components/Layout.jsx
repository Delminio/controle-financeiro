import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  { id: 'transactions', label: 'Lançamentos', icon: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6' },
  { id: 'categories', label: 'Categorias', icon: 'M3 12V4h8l10 10-8 8zM7.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
  { id: 'accounts', label: 'Contas Bancárias', icon: 'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18' },
  { id: 'cards', label: 'Cartões', icon: 'M3 6h18v12H3zM3 10h18M6 15h4' },
  { id: 'calendar', label: 'Calendário', icon: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4' },
  { id: 'charts', label: 'Gráficos', icon: 'M3 20h18M5 16l4-5 4 3 6-8' },
  { id: 'budget', label: 'Orçamento', icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0' },
  { id: 'goals', label: 'Metas', icon: 'M5 21V4M5 4h12l-2 4 2 4H5' },
  { id: 'debts', label: 'Empréstimos', icon: 'M4 8h14l-3-3M20 16H6l3 3' },
  { id: 'investments', label: 'Investimentos', icon: 'M3 17l6-6 4 4 8-8M15 7h6v6' },
  { id: 'emergency', label: 'Reserva Financeira', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' },
  { id: 'installments', label: 'Parcelas', icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 7v5l3 2' },
  { id: 'fixed', label: 'Contas Fixas', icon: 'M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3' },
  { id: 'forecast', label: 'Previsão', icon: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5' },
  { id: 'ai', label: 'Assistente IA', icon: 'M5 8h14v10H5zM12 4v4M9 12.5h.01M15 12.5h.01M9 15.5h6' },
  { id: 'reports', label: 'Relatórios', icon: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6' },
  { id: 'profile', label: 'Meu Perfil', icon: 'M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' }
];

export default function Layout({ children, activeTab, setActiveTab, user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark text-slate-100 bg-[#0e1220]' : 'text-[#161b2e] bg-[#f4f5f8]'} font-sans flex flex-col md:flex-row transition-colors`}>
      {/* Barra de Navegação Lateral Esquerda Fixa */}
      <nav className="fixed inset-y-0 left-0 w-56 bg-[#0f1a3a] flex flex-col justify-between p-5 z-40 overflow-y-auto hidden md:flex">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 text-white font-black text-base px-2">
            <span className="w-6 h-6 rounded-md bg-white text-[#0f1a3a] flex items-center justify-center font-extrabold text-sm">F</span>
            Finanças
          </div>

          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive 
                      ? 'bg-white/15 text-white font-semibold' 
                      : 'text-[#a9b3d6] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2f55d4] text-white flex items-center justify-center font-extrabold text-xs">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white truncate max-w-[90px]">{user.name || 'Usuário'}</span>
              <button onClick={() => setDarkMode(!darkMode)} className="text-[10px] text-[#a9b3d6] hover:text-white text-left cursor-pointer">
                {darkMode ? '☀️ Claro' : '🌙 Escuro'}
              </button>
            </div>
          </div>
          <button onClick={onLogout} className="text-xs text-rose-400 hover:text-rose-300 font-bold p-1 cursor-pointer" title="Sair">
            🚪
          </button>
        </div>
      </nav>

      {/* Header Mobile */}
      <header className="md:hidden bg-[#0f1a3a] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black">
          <span className="w-6 h-6 rounded-md bg-white text-[#0f1a3a] flex items-center justify-center font-extrabold text-xs">F</span>
          Finanças
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded bg-white/10 text-xs font-bold">
          {mobileOpen ? '✕ Fechar' : '☰ Menu'}
        </button>
      </header>

      {/* Menu Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-[#0f1a3a] z-40 p-4 overflow-y-auto flex flex-col gap-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg text-xs font-medium text-left ${activeTab === item.id ? 'bg-white/20 text-white' : 'text-[#a9b3d6]'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
          <button onClick={onLogout} className="mt-4 p-3 bg-rose-600 text-white font-bold rounded-lg text-xs text-center">
            Sair da Conta
          </button>
        </div>
      )}

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 md:ml-56 p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}