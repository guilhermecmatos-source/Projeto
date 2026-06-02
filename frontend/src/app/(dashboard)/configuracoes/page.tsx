'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Bell, Shield, Database } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <>
      <Header title="Configurações" subtitle="Preferências da plataforma e conta" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <Card title="Conta" subtitle="Dados do usuário">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-fleet-muted">Nome</label>
              <input defaultValue="Administrador Fleet" className="w-full mt-1 px-4 py-2 rounded-lg bg-fleet-surface border border-fleet-border text-white" readOnly />
            </div>
            <div>
              <label className="text-sm text-fleet-muted">E-mail</label>
              <input defaultValue="admin@fleetai.com" className="w-full mt-1 px-4 py-2 rounded-lg bg-fleet-surface border border-fleet-border text-white" readOnly />
            </div>
            <Button variant="secondary">Alterar senha</Button>
          </div>
        </Card>

        <Card title="Notificações">
          <div className="space-y-3">
            {['Alertas críticos', 'Previsões IA', 'Relatórios diários', 'Ocorrências'].map((n) => (
              <label key={n} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-zinc-300">{n}</span>
                <input type="checkbox" defaultChecked className="rounded bg-fleet-surface border-fleet-border" />
              </label>
            ))}
          </div>
        </Card>

        <Card title="Empresa">
          <p className="text-white font-medium">Logística Brasil S.A.</p>
          <p className="text-sm text-fleet-muted mt-1">Plano Enterprise · Segmento Logística</p>
        </Card>

        <Card title="Sistema">
          <div className="flex flex-wrap gap-4 text-sm text-fleet-muted">
            <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> v1.0.0</span>
            <span className="flex items-center gap-2"><Database className="w-4 h-4" /> MySQL</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> JWT Auth</span>
            <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Webhooks</span>
          </div>
        </Card>
      </div>
    </>
  );
}
