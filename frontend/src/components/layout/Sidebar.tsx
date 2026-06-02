'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Package,
  UserCircle,
  ShoppingCart,
  Radio,
  FlaskConical,
  Brain,
  Boxes,
  Settings,
  LogOut,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/veiculos', label: 'Veículos', icon: Truck },
  { href: '/motoristas', label: 'Motoristas', icon: Users },
  { href: '/rotas', label: 'Rotas', icon: Route },
  { href: '/estoque', label: 'Estoque', icon: Package },
  { href: '/clientes', label: 'Clientes', icon: UserCircle },
  { href: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/comando', label: 'Centro de Comando', icon: Radio },
  { href: '/inteligencia', label: 'Inteligência IA', icon: Cpu },
  { href: '/simulacoes', label: 'Simulações', icon: FlaskConical },
  { href: '/gemeo-digital', label: 'Gêmeo Digital', icon: Boxes },
  { href: '/ceo-ai', label: 'CEO AI', icon: Brain, highlight: true },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem('fleet_token');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-fleet-border bg-fleet-surface/95 backdrop-blur-xl flex flex-col">
      <div className="p-6 border-b border-fleet-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fleet-accent to-fleet-cyan flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">Fleet AI</span>
            <p className="text-[10px] text-fleet-muted uppercase tracking-widest">Enterprise</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                active
                  ? 'bg-fleet-accent/15 text-fleet-accent border border-fleet-accent/20'
                  : 'text-fleet-muted hover:text-white hover:bg-fleet-card',
                item.highlight && !active && 'text-purple-400 hover:text-purple-300'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-fleet-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-fleet-muted hover:text-fleet-danger hover:bg-fleet-danger/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
