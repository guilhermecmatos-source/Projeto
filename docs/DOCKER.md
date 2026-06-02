# Fleet AI — Docker e acesso mobile

## Subir tudo com Docker

Na raiz do projeto:

```bash
cp .env.docker.example .env
docker compose up -d --build
```

Aguarde o build (primeira vez pode levar alguns minutos). Serviços:

| Serviço   | Porta | URL local        |
|-----------|-------|------------------|
| Frontend  | 3000  | http://localhost:3000 |
| API       | 4000  | http://localhost:4000/api |
| MySQL     | 3306  | (interno)        |

### Credenciais demo

- E-mail: `admin@fleetai.com`
- Senha: `fleetai123`

---

## Acessar pelo celular (mesma rede Wi‑Fi)

O frontend usa **proxy `/api`** no Next.js, então o celular só precisa abrir a porta **3000** do seu PC — não use `localhost` no telefone.

### 1. Descubra o IP do computador

**Linux:**
```bash
hostname -I | awk '{print $1}'
```

**Ou:**
```bash
ip -4 route get 1.1.1.1 | awk '{print $7; exit}'
```

Exemplo: `192.168.1.105`

### 2. No celular

Abra o navegador e acesse:

```
http://192.168.1.105:3000
```

(substitua pelo seu IP)

### 3. Firewall (se não abrir)

**Linux (ufw):**
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
```

### 4. Docker no Linux

O Docker já publica `0.0.0.0:3000` por padrão — acessível na rede local.

---

## Comandos úteis

```bash
# Ver logs
docker compose logs -f

# Parar
docker compose down

# Rebuild após mudanças
docker compose up -d --build

# Só MySQL (dev local sem Docker no app)
docker compose up -d mysql
```

---

## Variáveis (.env na raiz)

| Variável | Descrição |
|----------|-----------|
| `USE_MOCK_DATA=true` | Demo sem depender do MySQL (padrão) |
| `USE_MOCK_DATA=false` | API usa MySQL (aguarde healthcheck) |
| `CORS_ORIGIN=*` | Permite qualquer origem (útil com IP do celular) |

---

## Desenvolvimento local + celular (sem Docker no app)

Terminal 1:
```bash
cd backend && npm run dev
```

Terminal 2:
```bash
cd frontend
# .env.local: NEXT_PUBLIC_API_URL=/api e BACKEND_URL=http://0.0.0.0:4000
BACKEND_URL=http://127.0.0.1:4000 npm run dev -- -H 0.0.0.0
```

No celular: `http://SEU_IP:3000`

---

## Solução de problemas

| Problema | Solução |
|----------|---------|
| Login falha no celular | Confirme que acessa por `http://IP:3000`, não `localhost` |
| API não responde | `docker compose ps` — frontend e backend `Up` |
| Build frontend falha | `docker compose build frontend --no-cache` |
| MySQL não inicia | `docker compose down -v` (apaga volume) e suba de novo |
