'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingDown, Target, Truck, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<{
    revenue: number;
    operationalCost: number;
    savingsGenerated: number;
    onTimeRate: number;
    fleetUtilization: number;
    revenueTrend: number[];
    costTrend: number[];
  } | null>(null);
  const [alerts, setAlerts] = useState<{ id: number; type: string; title: string; message: string }[]>([]);

  useEffect(() => {
    api<typeof kpis>('/dashboard/kpis').then(setKpis).catch(console.error);
    api<typeof alerts>('/dashboard/alerts').then(setAlerts).catch(console.error);
  }, []);

  const chartData =
    kpis?.revenueTrend.map((r, i) => ({
      name: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
      Receita: r,
      Custos: kpis.costTrend[i],
    })) || [];

  return (
    <>
      <Header title="Dashboard Executivo" subtitle="Visão consolidada da operação em tempo real" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Receita"
          value={kpis ? formatCurrency(kpis.revenue) : '—'}
          change="+4.2% vs semana anterior"
          changePositive
          icon={DollarSign}
        />
        <StatCard
          title="Custos Operacionais"
          value={kpis ? formatCurrency(kpis.operationalCost) : '—'}
          change="-1.1% otimização"
          changePositive
          icon={TrendingDown}
          iconColor="text-fleet-warning"
        />
        <StatCard
          title="Economia Gerada"
          value={kpis ? formatCurrency(kpis.savingsGenerated) : '—'}
          change="IA + rotas otimizadas"
          changePositive
          icon={Target}
          iconColor="text-fleet-success"
        />
        <StatCard
          title="Utilização da Frota"
          value={kpis ? `${kpis.fleetUtilization}%` : '—'}
          change={`${kpis?.onTimeRate}% entregas no prazo`}
          changePositive
          icon={Truck}
          iconColor="text-fleet-cyan"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Receita vs Custos" subtitle="Últimos 7 dias" className="xl:col-span-2" glow>
          {chartData.length > 0 && (
            <AreaChart
              data={chartData}
              dataKeys={[
                { key: 'Receita', color: '#3b82f6', name: 'Receita' },
                { key: 'Custos', color: '#f59e0b', name: 'Custos' },
              ]}
            />
          )}
        </Card>

        <Card title="Alertas Inteligentes" subtitle="Prioridade automática IA">
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex gap-3 p-3 rounded-lg bg-fleet-surface border border-fleet-border/50">
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    a.type === 'critico' ? 'text-fleet-danger' : a.type === 'ia' ? 'text-purple-400' : 'text-fleet-warning'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <Badge variant={a.type === 'critico' ? 'danger' : a.type === 'ia' ? 'ia' : 'warning'}>{a.type}</Badge>
                  </div>
                  <p className="text-xs text-fleet-muted mt-1">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
