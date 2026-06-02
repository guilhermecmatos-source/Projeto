'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Boxes, Truck, Users, Building, TrendingUp } from 'lucide-react';

const iconMap: Record<string, typeof Truck> = {
  truck: Truck,
  users: Users,
  building: Building,
  'trending-up': TrendingUp,
};

export default function GemeoDigitalPage() {
  const [scenarios, setScenarios] = useState<{ id: string; label: string; icon: string }[]>([]);
  const [state, setState] = useState<{ healthScore: number; entities: Record<string, number> } | null>(null);
  const [result, setResult] = useState<{
    title: string;
    financialImpact: number;
    operationalImpact: string;
    projections: Record<string, unknown>;
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<typeof scenarios>('/digital-twin/scenarios').then(setScenarios).catch(console.error);
    api<typeof state>('/digital-twin/state').then(setState).catch(console.error);
  }, []);

  const simulate = async (eventType: string) => {
    setLoading(true);
    try {
      const params =
        eventType === 'veiculo_quebra'
          ? { vehicleName: 'Volvo FH 540', downtimeDays: 3 }
          : eventType === 'contratacao'
            ? { employees: 10, role: 'operacional' }
            : eventType === 'nova_unidade'
              ? { city: 'Sorocaba' }
              : { growthPercent: 30 };
      const data = await api<typeof result>('/digital-twin/simulate', {
        method: 'POST',
        body: JSON.stringify({ eventType, params }),
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Gêmeo Digital Empresarial" subtitle="Teste cenários what-if na operação virtual" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <Boxes className="w-10 h-10 text-fleet-cyan mx-auto mb-2" />
          <p className="text-sm text-fleet-muted">Saúde Operacional</p>
          <p className="text-3xl font-bold text-white">{state?.healthScore ?? '—'}%</p>
        </Card>
        <Card className="md:col-span-2">
          <p className="text-sm text-fleet-muted mb-3">Entidades sincronizadas</p>
          <div className="flex flex-wrap gap-4">
            {state &&
              Object.entries(state.entities).map(([k, v]) => (
                <span key={k} className="text-sm">
                  <span className="text-fleet-accent font-semibold">{v}</span>{' '}
                  <span className="text-fleet-muted">{k}</span>
                </span>
              ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {scenarios.map((s) => {
          const Icon = iconMap[s.icon] || Boxes;
          return (
            <Card key={s.id} className="hover:border-purple-500/30 transition-colors">
              <Icon className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-medium text-white">{s.label}</h3>
              <Button className="mt-4" variant="secondary" size="sm" onClick={() => simulate(s.id)} loading={loading}>
                Executar cenário
              </Button>
            </Card>
          );
        })}
      </div>

      {result && (
        <Card title={result.title} glow className="border-purple-500/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-fleet-muted">Impacto Financeiro</p>
              <p className={`text-2xl font-bold ${result.financialImpact >= 0 ? 'text-fleet-success' : 'text-fleet-danger'}`}>
                {formatCurrency(result.financialImpact)}
              </p>
              <p className="text-sm text-zinc-300 mt-4">{result.operationalImpact}</p>
            </div>
            <div>
              <p className="text-sm text-fleet-muted mb-2">Recomendações</p>
              <ul className="space-y-1">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-purple-300">
                    • {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
