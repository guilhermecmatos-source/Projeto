'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
  city: string;
  region: string;
  totalPurchases: number;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    api<Client[]>('/commercial/clients').then(setClients).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Clientes" subtitle="Integração comercial e histórico de compras" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((c) => (
          <Card key={c.id}>
            <h3 className="font-semibold text-white text-lg">{c.name}</h3>
            <p className="text-sm text-fleet-muted mt-1">{c.city} · {c.region}</p>
            <p className="text-2xl font-bold text-fleet-accent mt-4">{formatCurrency(c.totalPurchases)}</p>
            <p className="text-xs text-fleet-muted mt-1">Total em compras</p>
          </Card>
        ))}
      </div>
    </>
  );
}
