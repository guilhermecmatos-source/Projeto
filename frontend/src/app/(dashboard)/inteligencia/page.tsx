'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Brain, Route, AlertTriangle, Lightbulb } from 'lucide-react';

export default function InteligenciaPage() {
  const [predictions, setPredictions] = useState<{ id: number; type: string; entity: string; confidence: number; message: string }[]>([]);
  const [recommendations, setRecommendations] = useState<{ priority: number; title: string; impact: string; effort: string }[]>([]);

  useEffect(() => {
    api<typeof predictions>('/ai/predictions').then(setPredictions).catch(console.error);
    api<typeof recommendations>('/ai/strategic-recommendations').then(setRecommendations).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Inteligência Artificial" subtitle="Previsões, gargalos e recomendações estratégicas" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Previsões ativas" subtitle="Modelos em execução">
          <div className="space-y-3">
            {predictions.map((p) => (
              <div key={p.id} className="p-4 rounded-lg bg-fleet-surface border border-fleet-border">
                <div className="flex justify-between items-start">
                  <Badge variant="ia">{p.type}</Badge>
                  <span className="text-sm text-fleet-cyan">{p.confidence}% confiança</span>
                </div>
                <p className="text-white mt-2 font-medium">{p.entity}</p>
                <p className="text-sm text-fleet-muted mt-1">{p.message}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Recomendações estratégicas">
          <div className="space-y-3">
            {recommendations.map((r) => (
              <div key={r.priority} className="flex gap-3 p-4 rounded-lg bg-fleet-surface">
                <div className="w-8 h-8 rounded-full bg-fleet-accent/20 flex items-center justify-center text-fleet-accent font-bold text-sm">
                  {r.priority}
                </div>
                <div>
                  <p className="text-white font-medium">{r.title}</p>
                  <p className="text-sm text-fleet-success">{r.impact}</p>
                  <Badge variant="default" className="mt-1">Esforço: {r.effort}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
