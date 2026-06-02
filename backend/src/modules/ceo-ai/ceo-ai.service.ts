import { mockKpis, mockRoutes, mockProducts, mockVehicles, mockClients, mockBranches } from '../../data/mockData';

interface AnalysisContext {
  kpis: typeof mockKpis;
  routes: typeof mockRoutes;
  products: typeof mockProducts;
  vehicles: typeof mockVehicles;
  clients: typeof mockClients;
  branches: typeof mockBranches;
}

const context: AnalysisContext = {
  kpis: mockKpis,
  routes: mockRoutes,
  products: mockProducts,
  vehicles: mockVehicles,
  clients: mockClients,
  branches: mockBranches,
};

const patterns: { keywords: string[]; handler: (q: string) => { answer: string; sources: string[] } }[] = [
  {
    keywords: ['perdendo', 'dinheiro', 'prejuízo', 'custo alto', 'desperdício'],
    handler: () => ({
      answer: `Com base nos dados operacionais, identifiquei **3 áreas de perda financeira**:

1. **Rotas ineficientes** — A rota RT-002 (CD Osasco → Zona Leste) apresenta custo 23% acima da média por km. Consolidar com RT-001 economizaria ~R$ 12.400/mês.

2. **Estoque parado** — SKU-002 (Pneus) com giro baixo e estoque crítico simultâneo indica compra mal dimensionada. Risco de ruptura + capital imobilizado: ~R$ 18.900.

3. **Frota ociosa** — 2 veículos disponíveis (Mercedes Actros, Honda CG) com utilização < 40%. Custo fixo estimado: R$ 28.000/mês sem retorno proporcional.

**Recomendação:** Priorize otimização de rotas zona leste e revisão da política de reposição de pneus.`,
      sources: ['kpi_snapshots', 'routes', 'products', 'vehicles'],
    }),
  },
  {
    keywords: ['risco', 'setor', 'ameaça', 'vulnerável'],
    handler: () => ({
      answer: `**Análise de risco por setor:**

| Setor | Nível | Motivo |
|-------|-------|--------|
| Estoque | **Alto** | 2 SKUs abaixo do mínimo, incluindo item crítico (pneus) |
| Rotas | Médio | 1 rota com atraso previsto (87% confiança IA) |
| Frota | Médio | Drone com alerta de sensor — monitoramento ativo |
| Comercial | Baixo | Pedidos estáveis, 94.2% entregas no prazo |

O **setor de maior risco operacional** é **Estoque/Supply**, pois ruptura de pneus pode paralisar 2 caminhões (impacto: R$ 45.000/dia em entregas).`,
      sources: ['products', 'incidents', 'ai_predictions'],
    }),
  },
  {
    keywords: ['reduzir', 'custos', 'economia', 'economizar'],
    handler: () => ({
      answer: `**Plano de redução de custos (projeção 90 dias):**

1. **Consolidação de rotas** → Economia: R$ 37.200 (12.400/mês × 3)
2. **Otimização de combustível** (rota alternativa IA) → R$ 8.100
3. **Redução de ociosidade de frota** → R$ 42.000 (realocar ou terceirizar 1 veículo)
4. **Reposição inteligente de estoque** → R$ 6.500 (evitar compras emergenciais)

**Total projetado: R$ 93.800** em 90 dias, alinhado à meta de savings já registrada (R$ 187.500/mês em KPIs).`,
      sources: ['kpi_snapshots', 'routes', 'ai_predictions'],
    }),
  },
  {
    keywords: ['rota', 'despesa', 'gasto', 'caro'],
    handler: () => ({
      answer: `A rota com **maior custo relativo** é **RT-002 (CD Osasco → Zona Leste)**:
- Distância: 35,2 km
- Custo estimado/viagem: R$ 535 (combustível + pedágio)
- Custo/km: R$ 15,20 (23% acima da média de R$ 12,35)

Comparativo:
- RT-001: R$ 12,10/km (atraso atual +R$ 45)
- RT-003: R$ 10,02/km (concluída no prazo)

**Sugestão IA:** Rota alternativa via Av. Radial Leste reduz 8 km (-R$ 45/viagem).`,
      sources: ['routes', 'trips', 'ai_predictions'],
    }),
  },
  {
    keywords: ['filial', 'região', 'expandir', 'abrir', 'nova unidade'],
    handler: () => ({
      answer: `**Análise de expansão — melhor região para nova filial:**

Com base em volume de clientes e gap de cobertura:

1. **Interior SP (Sorocaba/Piracicaba)** — Score 92/100
   - Demanda não atendida: 3 clientes potenciais (R$ 1.2M/ano)
   - Distância média atual: 180 km (custo alto)
   - ROI projetado: 18-22 meses

2. **Grande ABC** — Score 85/100
   - Alta densidade, competição forte
   - ROI: 24 meses

3. **Litoral SP** — Score 78/100
   - Sazonalidade elevada

**Recomendação:** Priorize **Interior SP** com CD compartilhado em Campinas (já existente) como hub.`,
      sources: ['clients', 'branches', 'orders'],
    }),
  },
  {
    keywords: ['demanda', 'crescimento', 'futuro', 'previsão'],
    handler: () => ({
      answer: `**Previsão de demanda (próximos 90 dias):**

- Tendência de receita: **+4.2%** (baseado em série dos últimos 7 dias)
- Pico sazonal esperado: próximas 3 semanas (+12% pedidos)
- Capacidade atual: 78.5% utilização de frota

Se demanda crescer **30%**:
- Necessário: +12 veículos ou +18% eficiência operacional
- Investimento estimado: R$ 2.1M (frota) ou R$ 340K (otimização)
- Gargalo previsto: CD Osasco (separação) — IA detectou pico 14h-16h`,
      sources: ['kpi_snapshots', 'ai_predictions', 'orders'],
    }),
  },
];

export function processCeoQuestion(question: string): { answer: string; sources: string[] } {
  const q = question.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

  for (const pattern of patterns) {
    if (pattern.keywords.some((k) => q.includes(k.normalize('NFD').replace(/\p{M}/gu, '')))) {
      return pattern.handler(question);
    }
  }

  return {
    answer: `Analisei os dados da operação (receita: R$ ${(context.kpis.revenue / 1e6).toFixed(2)}M, custos: R$ ${(context.kpis.operationalCost / 1e6).toFixed(2)}M, ${context.vehicles.length} veículos, ${context.routes.length} rotas ativas).

Para uma resposta mais precisa, tente perguntar sobre:
- Onde estou perdendo dinheiro?
- Qual setor apresenta maior risco?
- Como reduzir custos?
- Qual rota gera mais despesas?
- Qual região abrir uma nova filial?`,
    sources: ['kpi_snapshots', 'dashboard'],
  };
}
