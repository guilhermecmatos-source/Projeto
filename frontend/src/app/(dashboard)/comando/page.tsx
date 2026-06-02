'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Radio, AlertCircle, Truck, Activity } from 'lucide-react';

export default function ComandoPage() {
  const [overview, setOverview] = useState<{
    activeRoutes: number;
    vehiclesInTransit: number;
    openIncidents: number;
    criticalAlerts: number;
    fleetHealth: number;
  } | null>(null);
  const [incidents, setIncidents] = useState<{ id: number; title: string; severity: string; status: string; type: string }[]>([]);

  useEffect(() => {
    api<typeof overview>('/command-center/overview').then(setOverview).catch(console.error);
    api<typeof incidents>('/command-center/incidents').then(setIncidents).catch(console.error);
    const interval = setInterval(() => {
      api<typeof overview>('/command-center/overview').then(setOverview).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header title="Centro de Comando" subtitle="Monitoramento em tempo real e reação automática" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Rotas Ativas" value={String(overview?.activeRoutes ?? '—')} icon={Radio} />
        <StatCard title="Em Trânsito" value={String(overview?.vehiclesInTransit ?? '—')} icon={Truck} iconColor="text-fleet-cyan" />
        <StatCard title="Ocorrências Abertas" value={String(overview?.openIncidents ?? '—')} icon={AlertCircle} iconColor="text-fleet-warning" />
        <StatCard title="Saúde da Frota" value={`${overview?.fleetHealth ?? '—'}%`} icon={Activity} iconColor="text-fleet-success" />
      </div>

      <Card title="Ocorrências" subtitle="Monitoramento e resolução">
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="flex items-center justify-between p-4 rounded-lg bg-fleet-surface border border-fleet-border">
              <div>
                <p className="font-medium text-white">{inc.title}</p>
                <p className="text-sm text-fleet-muted">{inc.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={inc.severity === 'critica' || inc.severity === 'alta' ? 'danger' : inc.severity === 'media' ? 'warning' : 'default'}>
                  {inc.severity}
                </Badge>
                <Badge variant="info">{inc.status}</Badge>
                {inc.status !== 'resolvida' && (
                  <Button size="sm" variant="secondary">
                    Resolver
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
