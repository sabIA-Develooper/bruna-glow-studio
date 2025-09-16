# Configuração do Backend Express

Este projeto foi desvinculado do Supabase e está pronto para usar um backend customizado com Express.js.

## Estrutura Atual

### Frontend (React + TypeScript)
- ✅ **Desvinculado do Supabase**
- ✅ **Cliente HTTP customizado** (`src/lib/api-client.ts`)
- ✅ **Tipos TypeScript** (`src/types/database.ts`)
- ✅ **Context de autenticação** atualizado
- ✅ **Componentes** atualizados para usar API customizada

### Arquivos Criados/Modificados

1. **`src/lib/api-client.ts`** - Cliente HTTP para comunicação com backend
2. **`src/types/database.ts`** - Tipos TypeScript para substituir Supabase
3. **`src/contexts/AuthContext.tsx`** - Refatorado para usar autenticação customizada
4. **`src/pages/Agendamento.tsx`** - Atualizado para usar API customizada
5. **`src/pages/Admin.tsx`** - Atualizado para usar API customizada
6. **`env.example`** - Exemplo de configuração de ambiente

## Próximos Passos - Implementar Backend Express

### 1. Criar Estrutura do Backend

```bash
mkdir backend
cd backend
npm init -y
npm install express cors helmet morgan dotenv
npm install -D @types/node @types/express @types/cors nodemon typescript ts-node
```

### 2. Estrutura de Pastas Sugerida

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── coursesController.ts
│   │   ├── servicesController.ts
│   │   ├── appointmentsController.ts
│   │   └── ordersController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Service.ts
│   │   ├── Appointment.ts
│   │   └── Order.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── services.ts
│   │   ├── appointments.ts
│   │   └── orders.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   └── ...
│   ├── utils/
│   │   ├── database.ts
│   │   └── jwt.ts
│   └── app.ts
├── package.json
└── .env
```

### 3. Endpoints Necessários

#### Autenticação (`/api/auth`)
- `POST /login` - Login do usuário
- `POST /register` - Registro de usuário
- `POST /logout` - Logout
- `GET /me` - Obter dados do usuário atual
- `POST /refresh` - Renovar token

#### Cursos (`/api/courses`)
- `GET /` - Listar cursos
- `GET /:id` - Obter curso específico
- `POST /` - Criar curso (admin)
- `PATCH /:id` - Atualizar curso (admin)
- `DELETE /:id` - Excluir curso (admin)

#### Serviços (`/api/services`)
- `GET /` - Listar serviços
- `GET /:id` - Obter serviço específico
- `POST /` - Criar serviço (admin)
- `PATCH /:id` - Atualizar serviço (admin)
- `DELETE /:id` - Excluir serviço (admin)

#### Agendamentos (`/api/appointments`)
- `GET /` - Listar agendamentos
- `GET /:id` - Obter agendamento específico
- `POST /` - Criar agendamento
- `PATCH /:id` - Atualizar agendamento
- `DELETE /:id` - Excluir agendamento

#### Pedidos (`/api/orders`)
- `GET /` - Listar pedidos
- `GET /:id` - Obter pedido específico
- `POST /` - Criar pedido
- `PATCH /:id` - Atualizar pedido
- `DELETE /:id` - Excluir pedido

### 4. Banco de Dados

Use as migrações do Supabase como referência para criar as tabelas:

```sql
-- Tabelas principais
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  content_url TEXT,
  duration TEXT,
  instructor TEXT DEFAULT 'Bruna',
  level TEXT DEFAULT 'Básico',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id),
  appointment_date TIMESTAMP NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 5. Configuração de Ambiente

Crie um arquivo `.env` no backend:

```env
# Banco de Dados
DATABASE_URL=postgresql://username:password@localhost:5432/bruna_glow_studio

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### 6. Configuração do Frontend

Crie um arquivo `.env` no frontend:

```env
VITE_API_URL=http://localhost:3001/api
```

### 7. Exemplo de Controller

```typescript
// src/controllers/coursesController.ts
import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';

export class CoursesController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  async getCourses(req: Request, res: Response) {
    try {
      const courses = await this.courseService.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cursos' });
    }
  }

  async getCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar curso' });
    }
  }

  async createCourse(req: Request, res: Response) {
    try {
      const courseData = req.body;
      const course = await this.courseService.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar curso' });
    }
  }

  // ... outros métodos
}
```

## Status Atual

✅ **Frontend completamente desvinculado do Supabase**
✅ **Pronto para integração com backend Express**
✅ **Tipos TypeScript definidos**
✅ **Cliente HTTP configurado**
✅ **Componentes atualizados**

🚀 **Próximo passo: Implementar o backend Express seguindo esta estrutura**
