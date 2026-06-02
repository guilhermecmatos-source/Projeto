'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Star } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  cpf: string;
  status: string;
  rating: number;
  phone: string;
}

export default function MotoristasPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    api<Driver[]>('/drivers').then(setDrivers).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Motoristas" subtitle="Cadastro e gestão da equipe de condução" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <Card key={d.id}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fleet-accent to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{d.name}</h3>
                <p className="text-sm text-fleet-muted">{d.phone}</p>
              </div>
              <Badge variant={d.status === 'disponivel' ? 'success' : 'info'}>{d.status.replace('_', ' ')}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-fleet-muted">CPF: {d.cpf}</span>
              <span className="flex items-center gap-1 text-fleet-warning">
                <Star className="w-4 h-4 fill-current" />
                {d.rating}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
