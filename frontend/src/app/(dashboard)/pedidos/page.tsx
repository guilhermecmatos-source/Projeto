'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<Order[]>('/commercial/orders').then(setOrders).catch(console.error);
  }, []);

  const statusVariant: Record<string, 'default' | 'info' | 'success' | 'warning'> = {
    pendente: 'warning',
    confirmado: 'default',
    em_transito: 'info',
    entregue: 'success',
  };

  return (
    <>
      <Header title="Pedidos" subtitle="Gestão de pedidos e integração logística" />
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-fleet-muted border-b border-fleet-border bg-fleet-surface/50">
              <th className="p-4">Nº Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Itens</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-fleet-border/50 hover:bg-fleet-card/30">
                <td className="p-4 font-mono text-fleet-cyan">{o.orderNumber}</td>
                <td className="p-4 text-white">{o.clientName}</td>
                <td className="p-4 text-fleet-muted">{o.itemsCount}</td>
                <td className="p-4 font-semibold text-white">{formatCurrency(o.totalAmount)}</td>
                <td className="p-4">
                  <Badge variant={statusVariant[o.status] || 'default'}>{o.status.replace('_', ' ')}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
