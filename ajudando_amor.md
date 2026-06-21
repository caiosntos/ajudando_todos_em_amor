Plano: Sistema de Formulário de Doações — "Ajudando Todos em Amor"

 Context

 Projeto novo (diretório vazio em /Users/caiosantos/ajudando-todos-em-amor). Objetivo: sistema simples para uma ONG receber doações via formulário público e gerenciá-las
 internamente.

 Três telas:
 1. Landing page — apresentação da causa + CTA para doar.
 2. Formulário de cadastro de doação — público, qualquer pessoa preenche.
 3. Admin — protegida por login; lista doações cadastradas e gera relatórios.

 Banco e CRUD via migrations em Postgres.

 Stack escolhida (confirmada com usuário)

 - Next.js (App Router) + TypeScript — landing, form e admin no mesmo app; API via Route Handlers.
 - Postgres acessado com pg (node-postgres).
 - Migrations em SQL puro via node-pg-migrate.
 - Auth admin: login email+senha, hash bcrypt, sessão via cookie JWT (jose).
 - Campos da doação: doador (nome, email, telefone), valor + tipo (dinheiro/item, quantidade), status + data, mensagem.

 Estrutura de pastas

 ajudando-todos-em-amor/
 ├── package.json
 ├── .env.local                  # DATABASE_URL, JWT_SECRET (NÃO commitar)
 ├── .env.example
 ├── migrations/                 # node-pg-migrate
 │   ├── 1__create_donations.js
 │   └── 2__create_admin_users.js
 ├── src/
 │   ├── lib/
 │   │   ├── db.ts               # pool pg singleton
 │   │   ├── auth.ts             # hash/verify senha, sign/verify JWT, getSession
 │   │   └── donations.ts        # CRUD + queries de relatório
 │   ├── middleware.ts           # protege /admin/*
 │   └── app/
 │       ├── page.tsx            # Landing
 │       ├── doar/page.tsx       # Form público (client component)
 │       ├── login/page.tsx      # Login admin
 │       ├── admin/
 │       │   ├── page.tsx        # Lista + filtros + relatório
 │       │   └── relatorio/route.ts  # export CSV
 │       └── api/
 │           ├── donations/route.ts        # POST criar, GET listar
 │           ├── donations/[id]/route.ts   # GET/PATCH/DELETE
 │           └── auth/login/route.ts       # POST login, logout
 └── README.md

 Banco de dados (migrations)

 migrations/1__create_donations.js

 Tabela donations:

 ┌──────────────────┬────────────────────────────────────────────────────────────────────┬─────────────────────┐
 │      coluna      │                                tipo                                │        nota         │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ id               │ uuid PK (gen_random_uuid())                                        │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ donor_name       │ text NOT NULL                                                      │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ donor_email      │ text NOT NULL                                                      │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ donor_phone      │ text                                                               │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ donation_type    │ text NOT NULL CHECK (money,item)                                   │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ amount           │ numeric(12,2)                                                      │ preenchido se money │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ item_description │ text                                                               │ preenchido se item  │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ item_quantity    │ integer                                                            │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ status           │ text NOT NULL DEFAULT 'pending' CHECK (pending,confirmed,canceled) │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ message          │ text                                                               │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ donated_at       │ date NOT NULL DEFAULT CURRENT_DATE                                 │                     │
 ├──────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────────┤
 │ created_at       │ timestamptz NOT NULL DEFAULT now()                                 │                     │
 └──────────────────┴────────────────────────────────────────────────────────────────────┴─────────────────────┘

 Índices: status, donated_at.
 Habilitar pgcrypto (CREATE EXTENSION IF NOT EXISTS pgcrypto) para gen_random_uuid().

 migrations/2__create_admin_users.js

 Tabela admin_users: id uuid PK, email text UNIQUE NOT NULL, password_hash text NOT NULL, created_at timestamptz.
 Cada migration tem exports.up e exports.down (rollback).

 Seed do primeiro admin: script npm run seed:admin que lê ADMIN_EMAIL/ADMIN_PASSWORD do env, gera hash bcrypt e faz INSERT.

 Camada de dados — src/lib/donations.ts

 Funções reusadas pelas API routes:
 - createDonation(data) — INSERT, retorna registro.
 - listDonations({ status?, from?, to? }) — SELECT com filtros opcionais.
 - getDonation(id), updateDonationStatus(id, status), deleteDonation(id).
 - getReportSummary({ from?, to? }) — agregações: total em R$ (SUM(amount) WHERE type=money), contagem por status, contagem total de itens. Usa SQL GROUP BY.

 src/lib/db.ts: pool pg único (padrão singleton para evitar esgotar conexões em dev/hot-reload).

 Telas

 Landing (app/page.tsx)

 Estática: título, descrição da ONG, imagem/hero, botão "Quero Doar" → /doar. Server component.

 Formulário (app/doar/page.tsx)

 Client component com form controlado. Campos conforme tabela. Toggle donation_type mostra valor (money) ou descrição+quantidade (item). Submit → POST /api/donations. Validação
 client + server. Tela de sucesso após envio. Sem auth.

 Login (app/login/page.tsx)

 Form email+senha → POST /api/auth/login. Em sucesso seta cookie httpOnly com JWT e redireciona /admin.

 Admin (app/admin/page.tsx)

 - Server component, lê sessão; middleware.ts redireciona não autenticados p/ /login.
 - Tabela de doações com filtros (status, intervalo de datas).
 - Painel de resumo (getReportSummary): total arrecadado, nº por status.
 - Ações por linha: confirmar/cancelar (PATCH), excluir (DELETE).
 - Botão "Exportar CSV" → /admin/relatorio?from=&to=&status= (download).

 Relatório CSV (app/admin/relatorio/route.ts)

 GET protegido; gera CSV das doações filtradas com header Content-Disposition: attachment.

 Auth — src/lib/auth.ts + middleware.ts

 - hashPassword/verifyPassword com bcrypt.
 - signToken/verifyToken com jose (HS256, JWT_SECRET).
 - Cookie session httpOnly, sameSite lax.
 - middleware.ts com matcher: ['/admin/:path*'] valida token; APIs de mutação (PATCH/DELETE donations, relatório) checam sessão também.

 Dependências

 next, react, pg, bcrypt, jose · dev: node-pg-migrate, typescript, @types/*, tsx (rodar seed).

 Scripts package.json:
 "migrate": "node-pg-migrate -m migrations",
 "migrate:up": "node-pg-migrate up -m migrations",
 "migrate:down": "node-pg-migrate down -m migrations",
 "seed:admin": "tsx scripts/seed-admin.ts",
 "dev": "next dev"
 node-pg-migrate usa DATABASE_URL.

 Passos de implementação

 1. npm init + instalar deps + tsconfig, config Next.
 2. .env.example (DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).
 3. Migrations 1 e 2 (up/down).
 4. lib/db.ts, lib/auth.ts, lib/donations.ts.
 5. API routes (donations CRUD, auth login/logout).
 6. middleware.ts.
 7. Telas: landing → doar → login → admin → relatório CSV.
 8. Script seed-admin.ts.
 9. README com setup.

 Verificação (end-to-end)

 1. Subir Postgres local (Docker: docker run -e POSTGRES_PASSWORD=... -p 5432:5432 postgres).
 2. npm run migrate:up → confirmar tabelas criadas (\dt). Testar migrate:down para validar rollback.
 3. npm run seed:admin → criar admin.
 4. npm run dev.
 5. /doar: enviar doação (money e item) → checar INSERT no banco.
 6. /login com credenciais do seed → acessar /admin.
 7. Admin: filtrar por status/data, confirmar resumo bate com dados, mudar status, excluir.
 8. Exportar CSV → abrir arquivo, validar conteúdo.
 9. Tentar /admin sem login → redireciona p/ /login.