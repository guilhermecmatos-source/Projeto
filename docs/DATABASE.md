# Fleet AI — Modelo de Dados (MySQL)

## Diagrama Entidade-Relacionamento (resumido)

```
companies ──┬── users
            ├── vehicles
            ├── drivers
            ├── routes ── trips
            ├── products ── stock_movements
            ├── clients ── orders
            ├── kpi_snapshots
            ├── alerts
            ├── incidents
            ├── simulations
            ├── digital_twin_scenarios
            ├── ceo_ai_conversations
            ├── ai_predictions
            └── branches
```

## Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `companies` | Empresas (multi-tenant) |
| `users` | Usuários e papéis (admin, manager, operator, viewer) |
| `vehicles` | Frota: caminhão, carro, moto, drone, robô |
| `drivers` | Motoristas |
| `routes` | Rotas planejadas |
| `trips` | Execução/viagens |
| `products` | Catálogo e estoque |
| `stock_movements` | Entradas/saídas |
| `clients` | Clientes comerciais |
| `orders` | Pedidos |
| `kpi_snapshots` | Métricas para dashboard |
| `alerts` | Alertas do sistema |
| `incidents` | Ocorrências (centro de comando) |
| `simulations` | Simulações empresariais |
| `digital_twin_scenarios` | Cenários do gêmeo digital |
| `ceo_ai_conversations` | Histórico CEO AI |
| `ai_predictions` | Previsões de IA |
| `branches` | Filiais e CDs |

## Tipos de Veículo

```sql
ENUM('caminhao', 'carro', 'moto', 'drone', 'robo')
```

## Instalação

```bash
# Via Docker
docker compose up -d mysql

# Manual
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Credenciais Demo (seed)

- **Email:** admin@fleetai.com
- **Senha:** fleetai123 (validada na API em modo demo)
