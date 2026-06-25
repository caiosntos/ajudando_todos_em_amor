# Ajudando Todos em Amor — Sistema de Doações


Sistema web para gerenciamento de doações da ONG Ajudando Todos em Amor (Araquari/SC).

---

## Pré-requisitos

| Ferramenta | Versão mínima 
|------------|--------------
| Node.js | 20.x 
| npm | 10.x (vem com Node)
| PostgreSQL | 14+ **ou** Docker Desktop 
| Git | -


---

## 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd ajudando_todos_em_amor
```

---

## 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto (nunca commitar):

```env
DATABASE_URL=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

---

## 3. Banco de dados

### Opção A — Docker (recomendado, sem instalar Postgres)

```bash
# Sobe só o banco em background
docker compose up db -d
```

O banco `ajudando_todos` já é criado automaticamente pelo container.

### Opção B — PostgreSQL local instalado

Crie o banco manualmente:

```sql
CREATE DATABASE ajudando_todos;
```

Certifique-se que o usuário e senha no `.env.local` batem com sua instalação local.

---

## 4. Instalar dependências

```bash
npm install
```

Se pedir aprovação de scripts nativos (bcrypt, esbuild, sharp):

```bash
npm approve-scripts bcrypt esbuild sharp core-js
```

---

## 5. Rodar as migrations

Cria todas as tabelas no banco:

```bash
npm run migrate:up
```

---

## 6. Criar o usuário admin

```bash
npm run seed:admin
```

Isso cria o login com as credenciais definidas em `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env.local`.

---

## 7. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

- Página pública: `/`
- Formulário de doação: `/doar`
- Login admin: `/login`
- Painel admin: `/admin`

---

## 8. Acessar de outro computador (ngrok)

O ngrok cria um túnel público para o servidor local, permitindo acessar o projeto de qualquer dispositivo na internet.

### Pré-requisito (uma única vez)
2. Instale o ngrok:
   ```bash
   npm install -g ngrok
   ```
3. Autentique o ngrok na sua máquina:
   ```bash
   ngrok config add-authtoken SEU_TOKEN_AQUI
   ```

### Usar o túnel

Com o projeto já rodando (`npm run dev`), abra um **segundo terminal** e execute:

```bash
npm run tunnel
```

O ngrok exibirá uma URL pública como `https://abc123.ngrok-free.app`. Cole essa URL em qualquer dispositivo para acessar o projeto.

---

## Rodando em produção com Docker


docker compose up -d --build
```

Depois rode as migrations e o seed dentro do container da aplicação:

```bash
docker compose exec app sh -c "node-pg-migrate up -m migrations"
docker compose exec app sh -c "node scripts/seed-admin.js"
```

Acesse: http://localhost:3000

---

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (hot reload) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o build de produção |
| `npm run migrate:up` | Aplica migrations pendentes |
| `npm run migrate:down` | Reverte a última migration |
| `npm run seed:admin` | Cria/atualiza o usuário admin |
| `npm run tunnel` | Abre túnel ngrok para acesso externo |

---

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v3** (design tokens customizados)
- **PostgreSQL** via `pg` + `node-pg-migrate`
- **Autenticação**: JWT httpOnly cookie via `jose` + `bcrypt`
- **PDF**: `jsPDF` + `jspdf-autotable` (gerado no cliente)
- **Docker**: imagem `node:20-alpine` com output standalone

---

## Estrutura principal

```
src/
  app/
    page.tsx          # Landing page pública
    doar/             # Formulário de doação
    login/            # Login admin
    admin/            # Painel de gestão (protegido)
    api/
      donations/      # CRUD de doações
      auth/login/     # Login / logout
  components/         # Componentes React reutilizáveis
  lib/
    db.ts             # Pool de conexão Postgres
    auth.ts           # JWT (sign/verify/getSession)
    donations.ts      # Queries de doações
migrations/           # Migrations SQL (node-pg-migrate)
scripts/
  seed-admin.ts       # Seed do usuário admin
```


---
