'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@fleetai.com');
  const [password, setPassword] = useState('fleetai123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await authApi.login(email, password);
      localStorage.setItem('fleet_token', token);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-fleet-bg">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fleet-accent/20 via-transparent to-fleet-cyan/10" />
        <div className="absolute inset-0 bg-grid-pattern bg-[length:48px_48px] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center p-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fleet-accent to-fleet-cyan flex items-center justify-center glow-accent">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">Fleet AI</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
              Decisões empresariais com inteligência artificial
            </h1>
            <p className="text-fleet-muted mt-4 text-lg max-w-md">
              Logística, operações, estoque, vendas e CEO AI em uma única plataforma enterprise.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
              {['Rotas inteligentes', 'Gêmeo Digital', 'CEO AI', 'Centro de Comando'].map((f) => (
                <div key={f} className="glass rounded-lg px-4 py-3 text-sm text-zinc-300">
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8 text-fleet-accent" />
            <span className="text-2xl font-bold text-white">Fleet AI</span>
          </div>

          <h2 className="text-2xl font-bold text-white">Entrar na plataforma</h2>
          <p className="text-fleet-muted mt-2 mb-8">Acesse sua conta empresarial</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-fleet-muted block mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fleet-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-fleet-card border border-fleet-border text-white focus:outline-none focus:border-fleet-accent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-fleet-muted block mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fleet-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-fleet-card border border-fleet-border text-white focus:outline-none focus:border-fleet-accent"
                  required
                />
              </div>
            </div>
            {error && <p className="text-fleet-danger text-sm">{error}</p>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Acessar Fleet AI
            </Button>
          </form>

          <p className="text-xs text-fleet-muted mt-6 text-center">
            Demo: admin@fleetai.com / fleetai123
          </p>
        </motion.div>
      </div>
    </div>
  );
}
