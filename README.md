# 🩺 Papômetro

Sistema de controle de cirurgias para residentes de medicina.
**PWA instalável** — funciona no celular como app nativo.

## Stack

| Camada   | Tecnologia                          |
|----------|-------------------------------------|
| Frontend | React 18 + TypeScript + Vite        |
| Estado   | TanStack Query v5                   |
| Backend  | Node.js + Express + TypeScript      |
| ORM      | Prisma                              |
| Banco    | PostgreSQL 16                       |
| Infra    | Docker Compose                      |
| PWA      | Web Manifest + Service Worker       |

---

## 🚀 Rodando localmente

### Pré-requisitos
- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Suba o banco
docker compose up -d

# 2. Configure .env
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Instale dependências
cd server && npm install
cd ../client && npm install

# 4. Migrations + seed
cd server
npm run db:migrate   # digite "init" quando pedir nome
npm run db:seed

# 5. Inicie os dois servidores em terminais separados
# Terminal 1:
cd server && npm run dev   # http://localhost:3333
# Terminal 2:
cd client && npm run dev   # http://localhost:5173
```

---

## 📱 Instalar como App no celular

### Android (Chrome)
1. Acesse o site no Chrome
2. Menu ⋮ → **"Adicionar à tela inicial"**

### iPhone/iPad (Safari)
1. Acesse no Safari → botão compartilhar (□↑)
2. **"Adicionar à Tela de Início"**

### Desktop (Chrome/Edge)
1. Acesse o site
2. Ícone de instalação na barra de endereço → Instalar

---

## ☁️ Deploy online (gratuito ou mínimo custo)

### Opção 1 — 100% grátis: Render + Vercel

| Serviço | O que hospeda | Custo |
|---------|--------------|-------|
| [Vercel](https://vercel.com) | Frontend React | **Grátis** |
| [Render](https://render.com) | Backend Node.js | **Grátis** (dorme 15min) |
| [Supabase](https://supabase.com) | PostgreSQL | **Grátis** (500MB) |

**Passo a passo:**

1. **Suba no GitHub:**
```bash
git init && git add . && git commit -m "init"
# Crie repositório em github.com e faça push
```

2. **Backend no Render:**
   - New → Web Service → importe o repo
   - Root Directory: `server`
   - Build: `npm install && npm run build && npx prisma generate`
   - Start: `node dist/server.js`
   - Adicione env vars: `DATABASE_URL`, `NODE_ENV=production`, `CLIENT_URL`
   - Após deploy: abra o Shell e rode `npx prisma migrate deploy && npx tsx prisma/seed.ts`

3. **Frontend na Vercel:**
   - New Project → importe o repo
   - Root Directory: `client`
   - Env: `VITE_API_URL=https://SEU-RENDER.onrender.com/api`
   - Deploy ✅

4. Volte ao Render e defina `CLIENT_URL=https://SEU-SITE.vercel.app`

---

### Opção 2 — Sempre ativo: Railway (~R$ 30/mês)

Backend no free tier do Render "dorme" após 15min. Para uso profissional:

| Serviço | Custo |
|---------|-------|
| Vercel (frontend) | **Grátis** |
| Railway (backend + PostgreSQL) | **~$5/mês** |

Deploy no Railway:
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Adicione um serviço PostgreSQL no projeto
3. Root Directory: `server`, configure env vars
4. O `render.yaml` serve de referência para as variáveis necessárias

---

### Resumo de custos

| Cenário | Custo/mês |
|---------|----------|
| Teste / uso leve | **R$ 0** |
| Uso profissional contínuo | **~R$ 30** (Railway) |
| VPS próprio (Hetzner/Hostinger) | **~R$ 20** |

---

## Comandos úteis

```bash
# Banco local
docker compose up -d
cd server
npm run db:migrate
npm run db:seed
npm run db:studio    # interface visual do banco

# Verificar tipos
cd client && npm run typecheck
cd server && npm run typecheck
```

## Estrutura

```
papometro/
├── client/                      # React + Vite (PWA)
│   ├── public/
│   │   ├── manifest.webmanifest # PWA manifest
│   │   ├── sw.js                # Service Worker (offline)
│   │   └── icons/               # Ícones do app (todos os tamanhos)
│   └── src/
│       ├── components/layout/   # Sidebar adaptativa (tabs no mobile)
│       ├── components/ui/       # Badge, Icon, Modal, StatCard
│       ├── hooks/               # useBreakpoint + React Query hooks
│       ├── pages/               # Dashboard, Surgeries, Patients...
│       ├── services/            # Axios API client
│       ├── styles/              # Tema + helpers responsivos
│       └── utils/               # Distribuição de cirurgias
├── server/                      # Express + Prisma
│   ├── prisma/
│   └── src/controllers|routes|middleware|lib
├── docker-compose.yml
├── render.yaml                  # Config Render.com
└── README.md
```
