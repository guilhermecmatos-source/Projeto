'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { vehicleTypeLabels } from '@/lib/utils';
import { Truck, Car, Bike, Plane, Bot } from 'lucide-react';

const typeIcons: Record<string, typeof Truck> = {
  caminhao: Truck,
  carro: Car,
  moto: Bike,
  drone: Plane,
  robo: Bot,
};

interface Vehicle {
  id: number;
  plate: string;
  name: string;
  type: string;
  brand: string;
  status: string;
  capacityKg: number;
  autonomyKm?: number;
}

export default function VeiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [summary, setSummary] = useState<{ type: string; count: number; active: number }[]>([]);

  useEffect(() => {
    api<Vehicle[]>('/vehicles').then(setVehicles).catch(console.error);
    api<typeof summary>('/vehicles/types/summary').then(setSummary).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Gestão de Veículos" subtitle="Caminhões, carros, motos, drones e robôs autônomos" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {summary.map((s) => {
          const Icon = typeIcons[s.type] || Truck;
          return (
            <Card key={s.type} className="!p-4 text-center">
              <Icon className="w-6 h-6 mx-auto text-fleet-accent mb-2" />
              <p className="text-xs text-fleet-muted">{vehicleTypeLabels[s.type]}</p>
              <p className="text-xl font-bold text-white">{s.count}</p>
              <p className="text-xs text-fleet-cyan">{s.active} ativos</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const Icon = typeIcons[v.type] || Truck;
          return (
            <Card key={v.id} className="hover:border-fleet-accent/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-fleet-surface">
                    <Icon className="w-6 h-6 text-fleet-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{v.name}</h3>
                    <p className="text-sm text-fleet-muted">{v.plate} · {v.brand}</p>
                  </div>
                </div>
                <Badge variant={v.status === 'em_rota' ? 'info' : v.status === 'disponivel' ? 'success' : 'warning'}>
                  {v.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-fleet-muted">
                <span>Capacidade: {v.capacityKg} kg</span>
                {v.autonomyKm && <span>Autonomia: {v.autonomyKm} km</span>}
              </div>
              <Badge variant="default" className="mt-3">{vehicleTypeLabels[v.type]}</Badge>
            </Card>
          );
        })}
      </div>
    </>
  );
}
