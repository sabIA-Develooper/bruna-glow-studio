# Configuração do Frontend

Para conectar o frontend ao backend, siga estes passos:

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend (pasta `bruna-glow-studio`):

```env
VITE_API_URL=http://localhost:3001/api
```

## 2. Atualizar o Cliente API

O arquivo `src/lib/api-client.ts` já está configurado para usar a variável `VITE_API_URL`.

## 3. Executar o Projeto

### Backend (Terminal 1):
```bash
cd backend
npm run dev
```

### Frontend (Terminal 2):
```bash
npm run dev
```

## 4. URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 5. Testando a Conexão

Acesse http://localhost:3001/health para verificar se o backend está funcionando.

## 6. Banco de Dados

Certifique-se de que o PostgreSQL está rodando e que o banco `bruna_glow_studio` existe.

### Criar banco:
```sql
CREATE DATABASE bruna_glow_studio;
```

### O backend criará automaticamente as tabelas na primeira execução.
