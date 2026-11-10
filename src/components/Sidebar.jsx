import React from 'react';

export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, user, handleLogout }) {
  const menuItems = [
    { id: 'dashboard', label: '1. Início / Dashboard', icon: '📊' },
    { id: 'transactions', label: '2. Lançamentos', icon: '📋' },
    { id: 'charts', label: '3. Gráficos e Análises', icon: '📈' },
    { id: 'categories', label: '4. Categorias', icon: '🏷️' },
    { id: 'accounts', label: '5. Contas Bancárias', icon: '🏦' },
    { id: 'cards', label: '6. Cartões de Crédito', icon: '💳' },
    { id: 'installments', label: '7. Parcelas', icon: '🗓️' },
    { id: 'fixed', label: '8. Contas Fixas', icon: '🔄' },
    { id: 'calendar', label: '9. Calendário Financeiro', icon: '📅' },
    { id: 'forecast', label: '10. Previsão Financeira', icon: '🔮' },
    { id: 'debts', label: '11. Empréstimos e Dívidas', icon: '🤝' },
    { id: 'investments', label: '12. Investimentos', icon: '💼' },
    { id: 'goals', label: '13. Metas Financeiras', icon: '🎯' },
    { id: 'emergency', label: '14. Reserva de Emergência', icon: '🛡️' },
    { id: 'budget', label: '15. Orçamento Mensal', icon: '📊' },
    { id: 'ai', label: '16. Assistente IA', icon: '🤖' },
    { id: 'reports', label: '17. Relatórios', icon: '📑' },
    { id: 'export', label: '18. Exportar Dados (Excel)', icon: '📥' },
    { id: 'settings', label: '19. Configurações', icon: '⚙️' },
    { id: 'profile', label: '20. Meu Perfil', icon: '👤' },
  ];

  return (
    <aside className={'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ' + (sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white">O</div>
          <span className="font-bold text-lg tracking-tight">organize</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 font-bold">✕</button>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-800/50">
        <p className="text-xs text-slate-400 font-medium">Utilizador Autenticado</p>
        <p className="text-xs font-bold text-white truncate">{user?.name || user?.email}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 hide-scrollbar">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ' + (activeSection === item.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}
          >
            <span>{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white py-2 rounded-xl text-xs font-bold transition">
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}