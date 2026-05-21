# 💰 Gestão Financeira — PDM

<p align="center">
Aplicação de gestão financeira pessoal desenvolvida para a disciplina de <b>Programação para Dispositivos Móveis (PDM)</b>, composta por uma API REST e um aplicativo mobile.
</p>

<p align="center">

![Node](https://img.shields.io/badge/Node.js-v18+-green)
![React Native](https://img.shields.io/badge/React_Native-Mobile-blue)
![Expo](https://img.shields.io/badge/Expo-SDK-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

</p>

---

# 📌 Sobre o Projeto

O sistema permite o gerenciamento financeiro pessoal por meio de:

- Cadastro de receitas
- Cadastro de despesas
- Categorias personalizadas
- Histórico financeiro
- Gráficos
- Resumo mensal
- Login simples
- Persistência em banco MySQL
- API REST integrada ao aplicativo

---

# 🏗 Estrutura do Projeto

```txt
Atividade_2_PDM/
│
├── gestao-financeira-api/
│       Backend (Node + Prisma + MySQL)
│
└── gestao-financeira/
        Aplicativo mobile (React Native + Expo)
```

---

# 📂 Estrutura das Pastas

## Backend

```txt
gestao-financeira-api/

src/
prisma/
postman/
.env
package.json
```

---

## Frontend

```txt
gestao-financeira/

app/
components/
services/
styles/
hooks/
assets/
contexts/
```

---

# ⚙ Tecnologias Utilizadas

## Backend

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT
- Zod
- Dotenv

## Frontend

- React Native
- Expo
- Expo Router
- Context API
- AsyncStorage

---

# ✨ Funcionalidades

### Login

- Validação simples de senha
- Persistência de sessão

---

### Dashboard

- Saldo atual
- Total de receitas
- Total de despesas
- Gráfico financeiro

---

### Transações

Permite:

✔ Criar  
✔ Editar  
✔ Excluir  
✔ Filtrar  

---

### Categorias

Categorias padrão:

- Alimentação
- Educação
- Casa
- Viagem
- Renda

Categorias customizadas:

✔ Criar  
✔ Excluir  

---

# 📋 Pré-requisitos

Instalar:

| Ferramenta | Versão |
|-----------|---------|
| Node | 18+ |
| MySQL | 8+ |
| Expo Go | Última |
| Android Studio | Opcional |

---

# 🚀 Configuração do Backend

Entre:

```bash
cd gestao-financeira-api
```

Instale:

```bash
npm install
```

---

## Criar .env

Crie:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/gestao_financeira"

PORT=3000
```

Exemplo:

```env
DATABASE_URL="mysql://root:1234@localhost:3306/gestao_financeira"

PORT=3000
```

---

# 🗄 Criar Banco

Execute:

```bash
npx prisma db push
```

Isso cria:

- Banco
- Tabelas
- Relacionamentos

automaticamente.

---

# 🌱 Popular banco

```bash
npm run prisma:seed
```

Insere:

```txt
Alimentação
Casa
Educação
Viagem
Renda
```

---

# 🔥 Rodar Backend

Desenvolvimento:

```bash
npm run dev
```

Produção:

```bash
npm start
```

API:

```txt
http://localhost:3000
```

---

# 🛠 Prisma Studio

Abrir visualização do banco:

```bash
npm run prisma:studio
```

Abrirá:

```txt
http://localhost:5556
```

---

# 📱 Rodando o Frontend

Entre:

```bash
cd gestao-financeira
```

Instale:

```bash
npm install
```

Inicie:

```bash
npx expo start
```

---

# 📲 Atalhos Expo

| Tecla | Ação |
|------|------|
| a | Android |
| i | IOS |
| w | Web |

---

# 🔐 Login

Use:

| Campo | Valor |
|-------|--------|
| Nome | Qualquer |
| Senha | 1234 |

Exemplo:

```txt
Nome: Maria

Senha: 1234
```

---

# 🔄 Rodar tudo simultaneamente

## Terminal 1

```bash
cd gestao-financeira-api

npm run dev
```

---

## Terminal 2

```bash
cd gestao-financeira

npx expo start
```

---

# 🌐 Endpoints API

## Categorias

| Método | Endpoint |
|---------|-----------|
| GET | /categories |
| POST | /categories |
| PUT | /categories/:id |
| DELETE | /categories/:id |

---

## Transações

| Método | Endpoint |
|---------|-----------|
| GET | /transactions |
| POST | /transactions |
| PUT | /transactions/:id |
| DELETE | /transactions/:id |

---

# 📁 Testes no Postman

Coleção disponível:

```txt
gestao-financeira-api/postman/
```

---

# 🧾 Resumo rápido dos comandos

| Objetivo | Comando |
|----------|----------|
| Instalar API | npm install |
| Criar tabelas | npx prisma db push |
| Popular banco | npm run prisma:seed |
| Rodar API | npm run dev |
| Rodar Prisma Studio | npm run prisma:studio |
| Instalar app | npm install |
| Rodar Expo | npx expo start |

---

# ⚡ Fluxo completo primeira execução

Backend:

```bash
cd gestao-financeira-api

npm install

npx prisma db push

npm run prisma:seed

npm run dev
```

Frontend:

```bash
cd gestao-financeira

npm install

npx expo start
```

---

# 🔥 Fluxo diário

Backend:

```bash
npm run dev
```

Frontend:

```bash
npx expo start
```

---

# 📌 Resultado esperado

Backend:

```txt
http://localhost:3000
```

Frontend:

```txt
Expo running
Android Emulator aberto
```

Banco:

```txt
MySQL conectado
Prisma sincronizado
```

Sistema:

✅ App funcionando  
✅ API funcionando  
✅ Banco funcionando  