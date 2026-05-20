# Gestao Financeira - PDM

Projeto composto por uma API REST (Node.js + Prisma + MySQL) e um app mobile (React Native + Expo).

---

## Estrutura do Projeto

```
Atividade_2_PDM/
├── gestao-financeira-api/   # Backend (API REST)
└── gestao-financeira/       # App mobile (Expo)
```

---

## Pre-requisitos

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://dev.mysql.com/downloads/) rodando localmente
- [Expo Go](https://expo.dev/go) no celular **ou** Android Emulator/iOS Simulator

---

## 1. API — `gestao-financeira-api`

### 1.1 Instalar dependencias

```bash
cd gestao-financeira-api
npm install
```

### 1.2 Configurar variavel de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do MySQL:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

> Substitua `USUARIO` e `SENHA` pelo usuario e senha do seu MySQL.  
> O banco `gestao_financeira` sera criado automaticamente pelo Prisma.

### 1.3 Criar o banco e rodar as migrations

```bash
npx prisma migrate dev
```

> Isso cria o banco de dados e todas as tabelas necessarias.

### 1.4 Popular o banco com categorias padrao (seed)

```bash
npm run prisma:seed
```

> Insere as categorias: Renda, Alimentacao, Casa, Educacao, Viagens.

### 1.5 Iniciar o servidor

**Desenvolvimento (com hot-reload):**

```bash
npm run dev
```

**Producao:**

```bash
npm start
```

A API ficara disponivel em: `http://localhost:3000`

### 1.6 (Opcional) Abrir o Prisma Studio

Interface visual para visualizar e editar dados no banco:

```bash
npm run prisma:studio
```

Acesse em: `http://localhost:5555`

---

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/` | Health check |
| GET | `/categories` | Listar categorias |
| POST | `/categories` | Criar categoria |
| PUT | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Deletar categoria (nao padrao) |
| GET | `/transactions` | Listar transacoes |
| POST | `/transactions` | Criar transacao |
| PUT | `/transactions/:id` | Atualizar transacao |
| DELETE | `/transactions/:id` | Deletar transacao |

---

## 2. App Mobile — `gestao-financeira`

### 2.1 Instalar dependencias

```bash
cd gestao-financeira
npm install
```

### 2.2 Iniciar o app

**Modo geral (escanear QR Code com Expo Go):**

```bash
npm start
```

**Abrir direto no Android:**

```bash
npm run android
```

**Abrir direto no iOS:**

```bash
npm run ios
```

**Abrir no navegador (web):**

```bash
npm run web
```

---

## Rodando o projeto completo

Abra dois terminais e execute em paralelo:

**Terminal 1 — API:**

```bash
cd gestao-financeira-api
npm run dev
```

**Terminal 2 — App:**

```bash
cd gestao-financeira
npm start
```

---

## Comandos resumidos

```bash
# --- API ---
cd gestao-financeira-api
npm install
cp .env.example .env          # configurar DATABASE_URL
npx prisma migrate dev        # criar banco e tabelas
npm run prisma:seed           # inserir categorias padrao
npm run dev                   # iniciar servidor

# --- App ---
cd gestao-financeira
npm install
npm start                     # iniciar Expo
```
