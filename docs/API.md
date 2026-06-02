# Fleet AI — Documentação da API REST

**Base URL:** `http://localhost:4000/api`

## Autenticação

### POST `/auth/login`
```json
{ "email": "admin@fleetai.com", "password": "fleetai123" }
```
**Resposta:** `{ "success": true, "data": { "token": "...", "user": {...} } }`

### GET `/auth/me`
Header: `Authorization: Bearer <token>`

---

## Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/kpis` | KPIs executivos |
| GET | `/dashboard/charts/revenue` | Dados para gráficos |
| GET | `/dashboard/alerts` | Alertas inteligentes |

## Veículos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/vehicles` | Lista frota (caminhão, carro, moto, drone, robô) |
| GET | `/vehicles/:id` | Detalhe |
| GET | `/vehicles/types/summary` | Resumo por tipo |

## Motoristas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/drivers` | Lista motoristas |
| GET | `/drivers/:id` | Detalhe |

## Rotas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/routes` | Rotas planejadas |
| GET | `/routes/tracking/live` | Posição em tempo real |
| GET | `/routes/history` | Histórico de viagens |

## Estoque

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/inventory/products` | Produtos |
| GET | `/inventory/alerts` | Alertas de reposição |
| GET | `/inventory/movements` | Movimentações |

## Comercial

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/commercial/clients` | Clientes |
| GET | `/commercial/orders` | Pedidos |
| GET | `/commercial/reports/summary` | Relatório comercial |

## Centro de Comando

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/command-center/overview` | Visão geral |
| GET | `/command-center/incidents` | Ocorrências |
| POST | `/command-center/incidents/:id/resolve` | Resolver ocorrência |
| GET | `/command-center/realtime` | Dados em tempo real |

## Simulações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/simulations/branches` | Filiais |
| POST | `/simulations/run` | Executar simulação |

**Body exemplo:**
```json
{
  "scenarioType": "demanda",
  "parameters": { "growthPercent": 30 }
}
```

## CEO AI

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/ceo-ai/ask` | Pergunta executiva |
| GET | `/ceo-ai/suggestions` | Perguntas sugeridas |

## Gêmeo Digital

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/digital-twin/scenarios` | Cenários disponíveis |
| GET | `/digital-twin/state` | Estado do gêmeo |
| POST | `/digital-twin/simulate` | Executar cenário what-if |

## Inteligência Artificial

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/ai/predictions` | Previsões |
| GET | `/ai/route-suggestions` | Sugestão de rota |
| GET | `/ai/bottlenecks` | Gargalos |
| GET | `/ai/strategic-recommendations` | Recomendações |
| POST | `/ai/delay-prediction` | Previsão de atraso |

## Health Check

`GET /api/health` — sem autenticação
