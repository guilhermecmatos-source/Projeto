'use client';

import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-fleet-muted text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fleet-muted" />
          <input
            type="search"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-fleet-card border border-fleet-border text-sm text-white placeholder:text-fleet-muted focus:outline-none focus:border-fleet-accent/50"
          />
        </div>
        <button className="relative p-2 rounded-lg bg-fleet-card border border-fleet-border hover:border-fleet-accent/30 transition-colors">
          <Bell className="w-5 h-5 text-fleet-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-fleet-danger rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fleet-accent to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
