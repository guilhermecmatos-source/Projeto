# Fleet AI — Arquitetura Técnica

## Visão Geral

A Fleet AI é uma plataforma SaaS modular para **tomada de decisão empresarial**, integrando logística, operações, estoque, vendas, automação e inteligência artificial.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│  React · TypeScript · TailwindCSS · Recharts · Framer Motion │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / JSON · JWT
┌──────────────────────────▼──────────────────────────────────┐
│                 Backend (Express + TypeScript)               │
│  Módulos: auth · dashboard · vehicles · routes · inventory   │
│  commercial · command-center · simulations · ceo-ai          │
│  digital-twin · ai                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │ MySQL 8
┌──────────────────────────▼──────────────────────────────────┐
│                      Banco de Dados                           │
└─────────────────────────────────────────────────────────────┘
```

## Princípios Arquiteturais

| Princípio | Implementação |
|-----------|---------------|
| Separação de responsabilidades | Módulos isolados por domínio (`/modules/*`) |
| Escalabilidade | API stateless, pool de conexões MySQL |
| Modularidade | Rotas, serviços e dados mock por módulo |
| API REST | Prefixo `/api`, respostas `{ success, data, error }` |

## Estrutura de Pastas

```
Projeto/
├── frontend/          # Next.js App Router
│   └── src/
│       ├── app/       # Páginas e rotas
│       ├── components/
│       └── lib/       # API client, utils
├── backend/
│   └── src/
│       ├── config/    # env, database
│       ├── modules/   # Domínios de negócio
│       ├── middleware/
│       └── data/      # Mock para demo
├── database/          # schema.sql, seed.sql
└── docs/              # Documentação
```

## Módulos de Negócio

### 1. Dashboard Executivo
KPIs consolidados, gráficos de receita/custo, alertas inteligentes.

### 2. Gestão de Rotas
Veículos, motoristas, planejamento, rastreamento simulado, histórico.

### 3. Inteligência Artificial (`/api/ai`)
Previsão de atrasos, sugestão de rotas, gargalos, recomendações estratégicas.

### 4. Centro de Comando
Overview em tempo real, ocorrências, resolução automatizada (simulada).

### 5. Simulação Empresarial
Cenários: filial, frota, CD, demanda — com projeção financeira.

### 6. CEO AI
Motor de respostas baseado em análise de dados operacionais (regras + contexto).

### 7. Gêmeo Digital
Cenários what-if: quebra de veículo, contratação, nova unidade, crescimento de demanda.

### 8. Estoque e Comercial
Produtos, alertas de reposição, clientes, pedidos, relatórios.

## Autenticação

- JWT Bearer Token
- Middleware `authMiddleware` em rotas protegidas
- Login demo: `admin@fleetai.com` / `fleetai123`

## Modo Demo (Mock)

Com `USE_MOCK_DATA=true`, o backend opera sem MySQL, usando `src/data/mockData.ts` — ideal para apresentações e TCC.

## Evolução Futura

- WebSockets para tempo real
- Integração com mapas (Google Maps / Mapbox)
- LLM externo para CEO AI (OpenAI / Azure)
- Multi-tenant completo por `company_id`
- Filas para processamento de IA (Redis + Bull)
