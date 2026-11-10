import React, { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Olá! Sou o seu assistente financeiro inteligente. Como posso ajudar a otimizar as suas finanças hoje?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input.trim() };
    const aiResponse = { sender: 'ai', text: 'Compreendi a sua dúvida. Com base nos seus lançamentos reais, recomendo manter o controle rigoroso das suas despesas fixas para maximizar a sua margem de poupança mensal.' };

    setMessages([...messages, userMsg, aiResponse]);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Assistente IA</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Consultoria financeira personalizada baseada nos seus dados reais</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[450px] justify-between">
        <div className="overflow-y-auto flex flex-col gap-4 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none shadow-md' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
          <input
            type="text"
            placeholder="Digite a sua dúvida financeira..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-extrabold cursor-pointer shadow-md transition">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}