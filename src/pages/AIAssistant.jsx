import React, { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Olá! Sou o seu Assistente Financeiro IA. Como posso ajudar com suas finanças hoje?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    setTimeout(() => {
      let aiResponse = 'Analisando seus dados financeiros...';
      if (currentInput.toLowerCase().includes('mercado')) {
        aiResponse = 'Você gastou R$ 1.250,00 com Mercado este mês (representando 35% das suas despesas totais).';
      } else if (currentInput.toLowerCase().includes('maior despesa') || currentInput.toLowerCase().includes('maior gasto')) {
        aiResponse = 'Sua maior despesa recorrente este mês foi com Moradia (Aluguel/Condomínio).';
      } else {
        aiResponse = 'Com base nos seus lançamentos, seu saldo atual é positivo e suas contas fixas estão em dia!';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto flex flex-col h-[550px] overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">🤖</div>
        <div>
          <h3 className="font-bold text-sm">Assistente Financeiro IA</h3>
          <p className="text-[10px] text-emerald-400 font-semibold">Conectado aos seus lançamentos reais</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs font-medium shadow-sm ${
              m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          placeholder="Pergunte algo sobre seus gastos (ex: Quanto gastei com mercado?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
        />
        <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
          Enviar
        </button>
      </form>
    </div>
  );
}