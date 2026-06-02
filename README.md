# Fleet AI

<p align="center">
  <strong>Plataforma SaaS de Decisão Empresarial com Inteligência Artificial</strong><br>
  Logística · Operações · Estoque · Vendas · Automação · IA
</p>

---

## Sobre o Projeto

A **Fleet AI** não é apenas um sistema de gerenciamento de rotas. É uma **plataforma inteligente de tomada de decisão empresarial** voltada para empresas de logística, automação comercial, supermercados, distribuidoras, indústrias e transportadoras.

O produto integra módulos operacionais com **CEO AI** (assistente executivo baseado em dados) e **Gêmeo Digital Empresarial** (simulação de cenários what-if), oferecendo uma experiência comparável a soluções enterprise do mercado.

### Diferenciais

| Recurso | Descrição |
|---------|-----------|
| **CEO AI** | Responde perguntas como *"Onde estou perdendo dinheiro?"* com base nos dados da operação |
| **Gêmeo Digital** | Simula impactos de quebra de veículo, contratações, novas unidades e crescimento de demanda |
| **Frota Futurista** | Suporte a caminhões, carros, motos, **drones** e **robôs autônomos** |
| **Centro de Comando** | Monitoramento em tempo real e gestão de ocorrências |
| **Simulação Empresarial** | Projeções financeiras para filiais, frota, CDs e demanda |

---

## Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS, Recharts, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Banco de Dados** | MySQL 8 |
| **Arquitetura** | Modular, REST API, JWT |

---

## Estrutura do Repositório

```
Projeto/
├── frontend/          # Interface web (Next.js)
├── backend/           # API REST (Express)
├── database/          # Schema e seed SQL
├── docs/              # Documentação técnica
├── docker-compose.yml # MySQL para desenvolvimento
└── README.md
```

Documentação detalhada:

- [Arquitetura](docs/ARCHITECTURE.md)
- [API REST](docs/API.md)
- [Banco de Dados](docs/DATABASE.md)

---

## Telas da Plataforma

- Login
- Dashboard Executivo
- Veículos · Motoristas · Rotas
- Estoque · Clientes · Pedidos
- Centro de Comando
- Simulações Empresariais
- Gêmeo Digital
- CEO AI
- Configurações

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm
- (Opcional) Docker para MySQL

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API disponível em: `http://localhost:4000/api`

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Aplicação em: `http://localhost:3000`

### 3. Banco de Dados (opcional)

```bash
docker compose up -d mysql
```

> Por padrão, `USE_MOCK_DATA=true` permite rodar **sem MySQL** para demonstrações.

### Credenciais de Demonstração

| Campo | Valor |
|-------|-------|
| E-mail | `admin@fleetai.com` |
| Senha | `fleetai123` |

---

## Módulos da API

| Módulo | Endpoint base |
|--------|---------------|
| Autenticação | `/api/auth` |
| Dashboard | `/api/dashboard` |
| Veículos | `/api/vehicles` |
| Motoristas | `/api/drivers` |
| Rotas | `/api/routes` |
| Estoque | `/api/inventory` |
| Comercial | `/api/commercial` |
| Centro de Comando | `/api/command-center` |
| Simulações | `/api/simulations` |
| CEO AI | `/api/ceo-ai` |
| Gêmeo Digital | `/api/digital-twin` |
| IA | `/api/ai` |

---

## Design

Interface inspirada em produtos como Tesla, SpaceX, Notion, Stripe e Microsoft:

- Tema escuro profissional
- Animações suaves (Framer Motion)
- Gráficos interativos (Recharts)
- Componentes reutilizáveis (Card, StatCard, Badge, Button)

---

## Contexto Acadêmico (TCC / SENAI)

Este projeto foi estruturado para apresentação em **Trabalho de Conclusão de Curso (TCC)** ou projetos integradores do **SENAI**, demonstrando:

1. **Análise de requisitos** — módulos alinhados a necessidades reais do setor logístico
2. **Arquitetura de software** — separação frontend/backend, API REST modular
3. **Modelagem de dados** — schema MySQL normalizado com relacionamentos
4. **Interface de usuário** — UX enterprise com design system consistente
5. **Inteligência artificial aplicada** — CEO AI e previsões baseadas em dados operacionais
6. **Inovação** — Gêmeo Digital e frota com drones/robôs

### Sugestão de Apresentação

1. Problema: decisões empresariais fragmentadas em sistemas isolados
2. Solução: Fleet AI como plataforma unificada
3. Demo ao vivo: Login → Dashboard → CEO AI → Gêmeo Digital
4. Arquitetura e tecnologias
5. Conclusão e trabalhos futuros

---

## Autor

Projeto desenvolvido para fins educacionais e demonstração de competências em desenvolvimento full stack.

---

## Licença

Uso acadêmico e educacional.
