'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { MapPin, Navigation } from 'lucide-react';

interface Route {
  id: number;
  name: string;
  code: string;
  distanceKm: number;
  estimatedDurationMin: number;
  status: string;
}

interface LiveVehicle {
  vehicleId: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  plate: string;
}

export default function RotasPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [live, setLive] = useState<LiveVehicle[]>([]);

  useEffect(() => {
    api<Route[]>('/routes').then(setRoutes).catch(console.error);
    api<LiveVehicle[]>('/routes/tracking/live').then(setLive).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Gestão de Rotas" subtitle="Planejamento, rastreamento e histórico" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <Card title="Rastreamento em tempo real" subtitle="Veículos em rota" glow>
          <div className="aspect-video rounded-lg bg-fleet-surface border border-fleet-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fleet-accent/5 to-fleet-cyan/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-12 h-12 text-fleet-accent mx-auto mb-2 animate-pulse-slow" />
                <p className="text-fleet-muted text-sm">Mapa simulado — São Paulo</p>
              </div>
            </div>
            {live.map((v, i) => (
              <div
                key={v.vehicleId}
                className="absolute w-3 h-3 bg-fleet-cyan rounded-full animate-pulse shadow-lg shadow-fleet-cyan/50"
                style={{ left: `${30 + i * 15}%`, top: `${40 + i * 10}%` }}
                title={v.name}
              />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {live.map((v) => (
              <div key={v.vehicleId} className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-fleet-cyan" />
                <span className="text-white">{v.name}</span>
                <span className="text-fleet-muted">({v.plate})</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Rotas ativas">
          <div className="space-y-3">
            {routes.map((r) => (
              <div key={r.id} className="p-4 rounded-lg bg-fleet-surface border border-fleet-border flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{r.name}</p>
                  <p className="text-sm text-fleet-muted">{r.code} · {r.distanceKm} km · ~{r.estimatedDurationMin} min</p>
                </div>
                <Badge variant={r.status === 'em_andamento' ? 'info' : r.status === 'concluida' ? 'success' : 'default'}>
                  {r.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
