# Gestão Financeira — PDM

Aplicação de gestão financeira pessoal composta por uma **API REST** (Node.js + Prisma + MySQL) e um **app mobile** (React Native + Expo).

## Estrutura do Projeto

Atividade_2_PDM/
├── gestao-financeira-api/   # Backend (API REST)
└── gestao-financeira/       # App mobile (Expo)



---

## Pré-requisitos

- Node.js v18+
- MySQL Server 8.0 instalado e **em execução**
- Expo Go no celular **ou** Android Emulator

---

## 1. Backend — `gestao-financeira-api`

### 1.1 Instalar dependências

```bash
cd gestao-financeira-api
npm install
1.2 Configurar variável de ambiente

cp .env.example .env
Edite o .env com suas credenciais do MySQL:


DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/gestao_financeira"
PORT=3000
O banco gestao_financeira será criado automaticamente pelo Prisma.

1.3 Criar o banco e as tabelas

npx prisma db push
1.4 Popular com categorias padrão

npm run prisma:seed
Insere as categorias: Renda, Alimentação, Casa, Educação, Viagens.

1.5 Iniciar o servidor

npm run dev        # desenvolvimento (hot-reload)
npm start          # produção
API disponível em: http://localhost:3000

1.6 Prisma Studio (opcional)
Interface visual para inspecionar o banco:


npm run prisma:studio
Acesse em: http://localhost:5556

2. App Mobile — gestao-financeira
2.1 Instalar dependências

cd gestao-financeira
npm install
2.2 Iniciar o app

npx expo start     # geral (QR Code com Expo Go)
Após iniciar, pressione a para abrir no emulador Android.

2.3 Login no app
Campo	Valor
Nome	Qualquer nome (ex: Maria)
Senha	1234
Rodando tudo ao mesmo tempo
Abra dois terminais em paralelo:


# Terminal 1 — API
cd gestao-financeira-api
npm run dev

# Terminal 2 — App
cd gestao-financeira
npx expo start
Endpoints da API
Método	Rota	Descrição
GET	/	Health check
GET	/categories	Listar categorias
POST	/categories	Criar categoria
PUT	/categories/:id	Atualizar categoria
DELETE	/categories/:id	Deletar categoria (não padrão)
GET	/transactions	Listar transações
POST	/transactions	Criar transação
PUT	/transactions/:id	Atualizar transação
DELETE	/transactions/:id	Deletar transação
A coleção completa do Postman está em gestao-financeira-api/postman/collection.json.

Funcionalidades
Login com validação de senha
Resumo financeiro com gráfico e filtro por mês/ano
Histórico de transações com filtros e edição/exclusão por toque longo
Cadastro de categorias personalizadas
Dados persistidos em banco de dados MySQL via API REST
Resumo dos comandos

# --- API (primeira vez) ---
cd gestao-financeira-api
npm install
cp .env.example .env
npx prisma db push
npm run prisma:seed

# --- API (uso diário) ---
cd gestao-financeira-api
npm run dev

# --- App (primeira vez) ---
cd gestao-financeira
npm install

# --- App (uso diário) ---
cd gestao-financeira
npx expo start