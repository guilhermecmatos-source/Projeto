'use client';

import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Brain, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CeoAiPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<string[]>('/ceo-ai/suggestions').then(setSuggestions).catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ask = async (question: string) => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    try {
      const data = await api<{ answer: string }>('/ceo-ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question }),
      });
      const formatted = data.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
      setMessages((m) => [...m, { role: 'assistant', content: formatted }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Erro ao processar. Verifique se a API está rodando.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="CEO AI" subtitle="Inteligência artificial para decisões empresariais estratégicas" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="xl:col-span-1 h-fit" title="Perguntas sugeridas">
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="w-full text-left text-sm p-3 rounded-lg bg-fleet-surface hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all text-zinc-300"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-3 min-h-[500px] flex flex-col border-purple-500/20 glow" glow>
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-fleet-border">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Assistente Executivo</p>
              <p className="text-xs text-fleet-muted">Respostas baseadas nos dados da operação</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
            {messages.length === 0 && (
              <div className="text-center py-12 text-fleet-muted">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400/50" />
                <p>Pergunte sobre custos, riscos, rotas ou expansão</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-fleet-accent text-white'
                      : 'bg-fleet-surface border border-fleet-border text-zinc-300 prose prose-invert prose-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-1 text-fleet-muted text-sm">
                <span className="animate-pulse">Analisando dados</span>
                <span className="animate-pulse delay-100">.</span>
                <span className="animate-pulse delay-200">.</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Onde estou perdendo dinheiro?"
              className="flex-1 px-4 py-3 rounded-lg bg-fleet-surface border border-fleet-border text-white focus:outline-none focus:border-purple-500/50"
            />
            <Button type="submit" loading={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
