# Bruna Glow Studio - Backend API

API backend para o sistema de gerenciamento do Bruna Glow Studio, desenvolvida com Express.js e TypeScript.

## 🚀 Funcionalidades

- **Autenticação JWT** - Sistema completo de login/registro
- **Gestão de Cursos** - CRUD completo para cursos
- **Gestão de Serviços** - CRUD completo para serviços de beleza
- **Sistema de Agendamentos** - Agendamento e gerenciamento de horários
- **Sistema de Pedidos** - Gestão de compras e pedidos
- **Middleware de Segurança** - Rate limiting, CORS, Helmet
- **Validação de Dados** - Validação robusta com Joi
- **Banco PostgreSQL** - Suporte completo ao PostgreSQL

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Configurar o arquivo `.env`:**
```env
# Banco de Dados
DATABASE_URL=postgresql://username:password@localhost:5432/bruna_glow_studio

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

4. **Criar banco de dados PostgreSQL:**
```sql
CREATE DATABASE bruna_glow_studio;
```

## 🚀 Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação (`/api/auth`)
- `POST /register` - Registro de usuário
- `POST /login` - Login
- `GET /me` - Perfil do usuário
- `PUT /profile` - Atualizar perfil
- `POST /refresh` - Renovar token
- `POST /logout` - Logout

### Cursos (`/api/courses`)
- `GET /` - Listar cursos
- `GET /:id` - Obter curso específico
- `POST /` - Criar curso (admin)
- `PUT /:id` - Atualizar curso (admin)
- `DELETE /:id` - Excluir curso (admin)

### Serviços (`/api/services`)
- `GET /` - Listar serviços
- `GET /:id` - Obter serviço específico
- `POST /` - Criar serviço (admin)
- `PUT /:id` - Atualizar serviço (admin)
- `DELETE /:id` - Excluir serviço (admin)

### Agendamentos (`/api/appointments`)
- `GET /` - Listar agendamentos
- `GET /my` - Meus agendamentos
- `GET /:id` - Obter agendamento específico
- `POST /` - Criar agendamento
- `PUT /:id` - Atualizar agendamento
- `DELETE /:id` - Excluir agendamento
- `GET /services/:serviceId/available-slots` - Horários disponíveis

### Pedidos (`/api/orders`)
- `GET /` - Listar pedidos (admin)
- `GET /my` - Meus pedidos
- `GET /:id` - Obter pedido específico
- `POST /` - Criar pedido
- `PUT /:id` - Atualizar pedido
- `DELETE /:id` - Excluir pedido
- `GET /stats` - Estatísticas (admin)

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 🛡️ Segurança

- **Rate Limiting** - Limite de requisições por IP
- **CORS** - Configurado para o frontend
- **Helmet** - Headers de segurança
- **Validação** - Validação robusta de dados
- **Sanitização** - Sanitização de inputs

## 📊 Banco de Dados

O sistema usa PostgreSQL com as seguintes tabelas:

- `profiles` - Perfis de usuários
- `courses` - Cursos disponíveis
- `services` - Serviços de beleza
- `appointments` - Agendamentos
- `orders` - Pedidos
- `order_items` - Itens dos pedidos

## 🧪 Testes

```bash
# Em desenvolvimento
npm run dev

# Verificar se está funcionando
curl http://localhost:3001/health
```

## 📝 Logs

A API gera logs detalhados usando Morgan para:
- Requisições HTTP
- Erros de aplicação
- Performance

## 🔧 Configuração de Desenvolvimento

1. **Hot Reload** - Usando nodemon
2. **TypeScript** - Compilação automática
3. **ESLint** - Linting de código
4. **Source Maps** - Para debugging

## 📦 Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada
- `npm run dev:build` - Compilar e executar

## 🌐 URLs Importantes

- **API Base**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **Documentação**: `http://localhost:3001/api/docs`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
