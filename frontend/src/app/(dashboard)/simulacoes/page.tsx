'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Building2, Truck, Warehouse, TrendingUp } from 'lucide-react';

const scenarios = [
  { type: 'filial', label: 'Nova Filial', icon: Building2, params: { city: 'Sorocaba', employees: 50 } },
  { type: 'frota', label: 'Aumento de Frota', icon: Truck, params: { vehicles: 5, vehicleType: 'caminhao' } },
  { type: 'cd', label: 'Novo CD', icon: Warehouse, params: { areaM2: 5000 } },
  { type: 'demanda', label: 'Crescimento Demanda', icon: TrendingUp, params: { growthPercent: 30 } },
];

export default function SimulacoesPage() {
  const [result, setResult] = useState<{
    projectedRevenue: number;
    projectedCost: number;
    projectedProfit: number;
    projectedRoi: number;
    impacts: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (scenarioType: string, parameters: Record<string, unknown>) => {
    setLoading(true);
    try {
      const data = await api<typeof result>('/simulations/run', {
        method: 'POST',
        body: JSON.stringify({ scenarioType, parameters }),
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Simulação Empresarial" subtitle="Projete impactos financeiros de decisões estratégicas" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {scenarios.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.type} className="hover:border-fleet-accent/40 transition-colors">
              <Icon className="w-8 h-8 text-fleet-accent mb-3" />
              <h3 className="font-semibold text-white">{s.label}</h3>
              <Button className="mt-4 w-full" size="sm" loading={loading} onClick={() => run(s.type, s.params)}>
                Simular
              </Button>
            </Card>
          );
        })}
      </div>

      {result && (
        <Card title="Resultado da Simulação" glow>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-fleet-muted">Receita Projetada</p>
              <p className="text-xl font-bold text-fleet-success">{formatCurrency(result.projectedRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-fleet-muted">Custo Projetado</p>
              <p className="text-xl font-bold text-fleet-warning">{formatCurrency(result.projectedCost)}</p>
            </div>
            <div>
              <p className="text-sm text-fleet-muted">Lucro</p>
              <p className="text-xl font-bold text-white">{formatCurrency(result.projectedProfit)}</p>
            </div>
            <div>
              <p className="text-sm text-fleet-muted">ROI</p>
              <p className="text-xl font-bold text-fleet-cyan">{result.projectedRoi}%</p>
            </div>
          </div>
          <ul className="space-y-2">
            {result.impacts.map((imp, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-fleet-accent">→</span> {imp}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
