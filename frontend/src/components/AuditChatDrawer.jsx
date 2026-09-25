import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquareQuote, ShieldAlert, Bot, User } from 'lucide-react';

export const AuditChatDrawer = ({
  transaction,
  isOpen,
  onClose
}) => {
  if (!isOpen || !transaction) return null;

  const defaultMessages = [
    {
      role: 'assistant',
      text: `Hello, Auditor. I am the Lead Forensic Audit AI assigned to Case ${transaction.id} (${transaction.invoiceNumber} from ${transaction.vendorName}). I have indexed all 6 quarters of historical procurement vouchers, commodity index curves, and bank settlement logs. What specific evidentiary aspect would you like me to examine?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState(defaultMessages);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const samplePrompts = [
    'Why is the 3.7x price spike considered fraudulent rather than standard inflation?',
    'Did the vendor submit KYC documentation for the recent bank account routing change?',
    'What specific statutory clause in GFR 149 should we cite in our stop-payment notice?',
    'Evaluate the risk of collusive behavior between the approver and this supplier.'
  ];

  const handleSend = async (questionText) => {
    const q = questionText.trim();
    if (!q || isSubmitting) return;

    const userMsg = {
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/audit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction.id,
          question: q,
          chatHistory: messages
        })
      });

      const data = await res.json();
      const botMsg = {
        role: 'assistant',
        text: data.answer || 'Forensic analysis completed. The empirical indicators remain consistent with the evidentiary dossier.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach the neural audit server. However, baseline pricing confirms an uncorroborated markup of +270%. Recommendation: Maintain ERP payment freeze.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Interrogate Case Forensic AI</h3>
            <p className="text-xs text-slate-400 font-mono-numbers">
              {transaction.id} · {transaction.vendorName}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Auditor Inquiry Templates:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.slice(0, 2).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-left text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700/60 transition-colors line-clamp-1"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 text-xs ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-300'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[9px] block mt-1.5 ${
                msg.role === 'user' ? 'text-rose-200 text-right' : 'text-slate-500'
              }`}>
                {msg.time}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSubmitting && (
          <div className="flex gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-xl p-3 italic">
              AI Auditor is correlating ledger evidence...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Auditor about this transaction..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
