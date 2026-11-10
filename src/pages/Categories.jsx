import React, { useState } from 'react';

const INITIAL_EXPENSE_GROUPS = [
  {
    name: 'CASA E MORADIA',
    color: 'bg-blue-500',
    items: ['Aluguel', 'Financiamento imobiliário', 'Condomínio', 'Água', 'Energia elétrica', 'Gás', 'Internet', 'TV por assinatura', 'Telefone', 'IPTU', 'Manutenção residencial', 'Produtos de limpeza', 'Móveis e decoração']
  },
  {
    name: 'ALIMENTAÇÃO',
    color: 'bg-emerald-500',
    items: ['Mercado', 'Padaria', 'Açougue', 'Restaurante', 'Delivery', 'Lanches', 'Feira', 'Alimentação fora de casa']
  },
  {
    name: 'TRANSPORTE',
    color: 'bg-amber-500',
    items: ['Combustível', 'Gasolina', 'Etanol', 'Diesel', 'Uber', 'Táxi', 'Ônibus', 'Estacionamento', 'Pedágio', 'Manutenção do veículo', 'Seguro do veículo', 'IPVA', 'Licenciamento', 'Lavagem do veículo']
  },
  {
    name: 'CONTAS E COMPROMISSOS',
    color: 'bg-rose-500',
    items: ['Cartão de crédito', 'Parcela', 'Empréstimo', 'Financiamento', 'Juros', 'Multas', 'Tarifas bancárias', 'Anuidade', 'Renegociação de dívida']
  },
  {
    name: 'SAÚDE',
    color: 'bg-teal-500',
    items: ['Farmácia', 'Consultas médicas', 'Exames', 'Plano de saúde', 'Dentista', 'Academia', 'Tratamentos', 'Terapias']
  },
  {
    name: 'EDUCAÇÃO',
    color: 'bg-indigo-500',
    items: ['Faculdade', 'Escola', 'Cursos', 'Livros', 'Material escolar', 'Cursos online']
  },
  {
    name: 'LAZER E ENTRETENIMENTO',
    color: 'bg-purple-500',
    items: ['Cinema', 'Viagens', 'Passeios', 'Festas', 'Jogos', 'Streaming', 'Hobbies', 'Eventos', 'Assinaturas digitais']
  },
  {
    name: 'COMPRAS PESSOAIS',
    color: 'bg-pink-500',
    items: ['Roupas', 'Calçados', 'Eletrônicos', 'Cosméticos', 'Perfumes', 'Acessórios', 'Presentes', 'Compras online']
  },
  {
    name: 'INVESTIMENTOS',
    color: 'bg-cyan-500',
    items: ['Poupança', 'CDB', 'Tesouro Direto', 'Fundos de investimento', 'Ações', 'Fundos imobiliários', 'Criptomoedas', 'Previdência privada']
  }
];

export default function Categories() {
  const [activeType, setActiveType] = useState('expense');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('CASA E MORADIA');

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customCategory.trim()) return;
    alert(`Categoria "${customCategory}" adicionada ao grupo ${selectedGroup}!`);
    setCustomCategory('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Categorias de Lançamentos</h2>
          <p className="text-xs text-slate-500">Organização das suas receitas e despesas por grupos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveType('expense')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeType === 'expense' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Despesas
          </button>
          <button
            onClick={() => setActiveType('income')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeType === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Recebimentos
          </button>
        </div>
      </div>

      {/* Formulário de Nova Categoria */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">+ Criar Categoria Personalizada</h3>
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
          >
            {INITIAL_EXPENSE_GROUPS.map(g => (
              <option key={g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome da nova categoria..."
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            required
          />
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
            Adicionar Categoria
          </button>
        </form>
      </div>

      {/* Grid de Grupos e Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_EXPENSE_GROUPS.map((group) => (
          <div key={group.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-3 h-3 rounded-full ${group.color}`}></span>
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{group.name}</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}