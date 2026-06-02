'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Package, AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<{ name: string; current: number; minimum: number; severity: string }[]>([]);

  useEffect(() => {
    api<Product[]>('/inventory/products').then(setProducts).catch(console.error);
    api<typeof alerts>('/inventory/alerts').then(setAlerts).catch(console.error);
  }, []);

  return (
    <>
      <Header title="Gestão de Estoque" subtitle="Produtos, movimentações e alertas de reposição" />

      {alerts.length > 0 && (
        <Card className="mb-6 border-fleet-danger/30">
          <div className="flex items-center gap-2 text-fleet-danger mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Alertas de reposição</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alerts.map((a) => (
              <Badge key={a.name} variant={a.severity === 'critico' ? 'danger' : 'warning'}>
                {a.name}: {a.current}/{a.minimum}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-fleet-muted border-b border-fleet-border">
              <th className="pb-3 pr-4">SKU</th>
              <th className="pb-3 pr-4">Produto</th>
              <th className="pb-3 pr-4">Categoria</th>
              <th className="pb-3 pr-4">Estoque</th>
              <th className="pb-3 pr-4">Mínimo</th>
              <th className="pb-3">Preço</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-fleet-border/50 hover:bg-fleet-card/50">
                <td className="py-4 pr-4 font-mono text-sm text-fleet-cyan">{p.sku}</td>
                <td className="py-4 pr-4 text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-fleet-muted" />
                  {p.name}
                </td>
                <td className="py-4 pr-4 text-fleet-muted">{p.category}</td>
                <td className="py-4 pr-4">
                  <span className={p.currentStock < p.minStock ? 'text-fleet-danger font-semibold' : 'text-white'}>
                    {p.currentStock}
                  </span>
                </td>
                <td className="py-4 pr-4 text-fleet-muted">{p.minStock}</td>
                <td className="py-4">{formatCurrency(p.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
