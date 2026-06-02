# Nexus AI

Plataforma empresarial para gestão operacional, mobilidade corporativa, logística, frota, estoque, pedidos e inteligência empresarial.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind + React Router + Axios + React Query
- Backend: Node.js + Express + TypeScript + Prisma + JWT + Bcrypt
- Banco: MySQL
- Containerização: Docker + Docker Compose

## Subir sem instalação manual

```bash
docker compose up -d --build
```

URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health

Usuário padrão:
- Email: `admin@nexusai.com`
- Senha: `admin123`
- Cargo: `ADMINISTRADOR`

## Módulos implementados

- Dashboard Executivo
- Gestão de Veículos (CRUD)
- Gestão de Motoristas (CRUD)
- Gestão de Usuários (CRUD com controle de acesso)
- SMART RUV (fluxo, aprovação/reprovação, assinatura, histórico)
- Movimentação de Veículo (saída, chegada, hodômetro, consumo, custo e eficiência)
- Alteração de Rota
- Estoque (CRUD)
- Clientes (CRUD)
- Pedidos (CRUD)
- Centro de Comando com botão resolver problema
- Relatórios (endpoint consolidado)
- Auditoria e logs
- CEO AI e módulo "O que a empresa não sabe"

## RBAC por cargo

- SOLICITANTE: cria solicitações e visualiza as suas
- MOTORISTA: viagens, saída/chegada e abastecimento
- GESTOR: aprova solicitações e relatórios
- COORDENADOR_TRANSPORTE: veículos, motoristas e rota
- ADMINISTRADOR: acesso total

## Estrutura

```
backend/
  prisma/schema.prisma
  prisma/seed.ts
  appsrc/
frontend/
  appsrc/
docker-compose.yml
```
