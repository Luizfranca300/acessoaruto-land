# Painel Administrativo - Acessorauto

## 🔐 Sistema de Autenticação

O painel administrativo foi implementado com autenticação JWT completa para gerenciar veículos e marcas do estoque.

### Credenciais Padrão

- **Email:** admin@acessorauto.com.br
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 🌐 Acesso ao Painel

### URLs

- **Login:** http://localhost:5173/admin/login
- **Dashboard:** http://localhost:5173/admin/dashboard (requer autenticação)

## 🛠️ Funcionalidades Implementadas

### Backend (API)

✅ **Autenticação JWT**

- Token expira em 24 horas
- Middleware de autenticação para rotas protegidas
- Verificação de role de administrador
- Senhas criptografadas com bcrypt

✅ **Endpoints de Autenticação**

```
POST /api/auth/login       - Login (público)
POST /api/auth/register    - Registro de novo admin (público)
GET  /api/auth/profile     - Perfil do usuário (requer token)
```

✅ **Rotas Protegidas**

```
POST   /api/brands         - Criar marca (requer admin)
POST   /api/vehicles       - Criar veículo (requer admin)
PUT    /api/vehicles/:id   - Atualizar veículo (requer admin)
DELETE /api/vehicles/:id   - Deletar veículo (requer admin)
```

✅ **Rotas Públicas**

```
GET /api/brands            - Listar marcas
GET /api/vehicles          - Listar veículos
GET /api/vehicles/:id      - Detalhes do veículo
GET /api/health            - Health check
```

### Frontend

✅ **Páginas Implementadas**

- **Login** (`/admin/login`) - Formulário de autenticação com validação
- **Dashboard** (`/admin/dashboard`) - Visão geral com estatísticas e ações rápidas

✅ **Gerenciamento de Token**

- Token armazenado no localStorage
- Funções helper: `saveToken()`, `getToken()`, `removeToken()`, `isAuthenticated()`
- Redirecionamento automático para login se não autenticado
- Logout limpa token e redireciona

✅ **Navegação com React Router**

- Rotas públicas (Home, Inventory, etc) com Header e Footer
- Rotas administrativas sem Header/Footer
- Uso de Links para navegação sem reload

## 📁 Estrutura de Arquivos

### Backend

```
acessorauto-api/
├── src/
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── controllers/
│   │   └── authController.js     # Lógica de autenticação
│   ├── routes/
│   │   └── index.js             # Rotas com proteção
│   └── server.js
├── database/
│   └── migrations/
│       └── 20251002_create_admin_users.sql
└── .env                         # JWT_SECRET
```

### Frontend

```
acessorauto-land/
├── src/
│   ├── lib/
│   │   ├── api.ts               # API client + auth functions
│   │   └── auth.ts              # Token management helpers
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Login.tsx        # Página de login
│   │   │   └── Dashboard.tsx    # Dashboard admin
│   │   ├── Home.tsx
│   │   ├── Inventory.tsx
│   │   └── VehicleDetail.tsx
│   └── App.tsx                  # Rotas com React Router
```

## 🔄 Próximos Passos (Pendentes)

### 1. Gerenciamento de Veículos

- [ ] Página de listagem de todos os veículos com edição/exclusão
- [ ] Formulário de criação de novo veículo
- [ ] Formulário de edição de veículo existente
- [ ] Upload de imagens (opções: URL, file upload, ou serviço terceiro)
- [ ] Confirmação antes de deletar

### 2. Gerenciamento de Marcas

- [ ] Página de listagem de marcas
- [ ] Formulário de criação de nova marca
- [ ] Edição e exclusão de marcas

### 3. Visualização de Contatos

- [ ] Listagem de contatos recebidos (contact_inquiries)
- [ ] Listagem de solicitações de avaliação (vehicle_valuations)
- [ ] Filtros e busca
- [ ] Marcar como lido/respondido

### 4. Melhorias

- [ ] Alterar senha do administrador
- [ ] Criar novos usuários admin
- [ ] Logs de auditoria (quem criou/editou/deletou)
- [ ] Dashboard com estatísticas reais (contar veículos, contatos, etc)
- [ ] Paginação nas listagens
- [ ] Exportação de dados (CSV, Excel)

## 🧪 Como Testar

### 1. Iniciar Backend e Frontend

```bash
# Terminal 1 - Backend
cd /Users/luiz/Documents/acessorauto-api
pnpm run dev

# Terminal 2 - Frontend
cd /Users/luiz/Documents/acessorauto-land
npm run dev
```

### 2. Testar Login

1. Acesse http://localhost:5173/admin/login
2. Use as credenciais: `admin@acessorauto.com.br` / `admin123`
3. Após login bem-sucedido, será redirecionado para o dashboard

### 3. Testar Autenticação

- Tente acessar `/admin/dashboard` sem estar logado → será redirecionado para login
- Faça login e acesse o dashboard → verá estatísticas e ações rápidas
- Clique em "Sair" → token é removido e redireciona para login

### 4. Testar API Diretamente

**Login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acessorauto.com.br","password":"admin123"}'
```

**Perfil (com token):**

```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Criar Veículo (requer admin):**

```bash
curl -X POST http://localhost:3001/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"brand_id":"uuid-da-marca","model":"Civic","year":2023,...}'
```

## 🔒 Segurança

### Implementado

✅ Senhas com hash bcrypt (custo 10)
✅ JWT com secret configurável
✅ Tokens com expiração (24h)
✅ Middleware de autenticação
✅ Verificação de role (admin)
✅ Queries parametrizadas (proteção SQL injection)

### Recomendações para Produção

- [ ] Usar variáveis de ambiente seguras (não commitar .env)
- [ ] HTTPS obrigatório
- [ ] Rate limiting nas rotas de login
- [ ] Refresh tokens para sessões longas
- [ ] Logs de tentativas de login falhas
- [ ] Autenticação de dois fatores (2FA)
- [ ] Política de senha forte
- [ ] Expiração de token mais curta (1-2 horas)

## 📊 Estrutura do Banco de Dados

### Tabela: admin_users

```sql
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- role (VARCHAR) - Valores: 'admin', 'user'
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Índices

- Índice único em `email`
- Comentários nas colunas para documentação

## 📝 Notas Técnicas

### Tecnologias Utilizadas

- **Backend:** Node.js, Express, PostgreSQL, bcryptjs, jsonwebtoken
- **Frontend:** React, TypeScript, React Router, Tailwind CSS
- **Autenticação:** JWT (JSON Web Tokens)
- **Segurança:** bcrypt para hashing de senhas

### Convenções

- ES Modules (import/export) em todo o código
- TypeScript no frontend
- Código em português (comentários, mensagens)
- Formato de data: pt-BR
- Moeda: R$ (Real Brasileiro)

## 🆘 Troubleshooting

### Erro: Token inválido ou expirado

- Faça logout e login novamente
- Verifique se JWT_SECRET está correto no .env do backend

### Erro: Não consegue fazer login

- Verifique se o backend está rodando (porta 3001)
- Confirme as credenciais no banco de dados
- Verifique logs do servidor para erros

### Erro: Redirecionamento infinito

- Limpe o localStorage: `localStorage.clear()`
- Verifique se o token está sendo salvo corretamente

### Erro: CORS

- Confirme que CORS_ORIGIN está configurado no .env do backend
- Verifique se o frontend está na porta 5173

---

**Desenvolvido para Acessorauto Veículos** 🚗
