# 🏷️ API de Gerenciamento de Marcas

## 📋 Requisitos do Backend

Esta documentação descreve os endpoints necessários no backend para o gerenciamento completo de marcas de veículos.

---

## 🔗 Endpoints Necessários

### 1. Listar Todas as Marcas

**Rota:** `GET /api/brands`

**Autenticação:** Não requer (público)

**Descrição:** Retorna todas as marcas cadastradas no sistema

**Response (200 OK):**

```json
[
  {
    "id": "uuid-aqui",
    "name": "Toyota",
    "logo_url": "https://exemplo.com/toyota-logo.png",
    "created_at": "2025-10-03T10:00:00.000Z",
    "updated_at": "2025-10-03T10:00:00.000Z"
  },
  {
    "id": "uuid-aqui-2",
    "name": "Honda",
    "logo_url": "https://exemplo.com/honda-logo.png",
    "created_at": "2025-10-03T11:00:00.000Z",
    "updated_at": "2025-10-03T11:00:00.000Z"
  }
]
```

---

### 2. Criar Nova Marca

**Rota:** `POST /api/brands`

**Autenticação:** ✅ Requer token JWT (Bearer)

**Permissão:** Admin apenas

**Request Body:**

```json
{
  "name": "Volkswagen",
  "logo_url": "https://exemplo.com/vw-logo.png"
}
```

**Validações:**

- `name` (obrigatório): String, mínimo 2 caracteres, máximo 50
- `logo_url` (opcional): String, deve ser URL válida se fornecida

**Response (201 Created):**

```json
{
  "id": "uuid-criado",
  "name": "Volkswagen",
  "logo_url": "https://exemplo.com/vw-logo.png",
  "created_at": "2025-10-03T12:00:00.000Z",
  "updated_at": "2025-10-03T12:00:00.000Z"
}
```

**Erros Possíveis:**

- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é admin
- `409 Conflict`: Marca com esse nome já existe

---

### 3. Atualizar Marca Existente

**Rota:** `PUT /api/brands/:id`

**Autenticação:** ✅ Requer token JWT (Bearer)

**Permissão:** Admin apenas

**Parâmetros de URL:**

- `id`: UUID da marca a ser atualizada

**Request Body:**

```json
{
  "name": "Volkswagen Motors",
  "logo_url": "https://exemplo.com/vw-novo-logo.png"
}
```

**Validações:**

- `name` (obrigatório): String, mínimo 2 caracteres, máximo 50
- `logo_url` (opcional): String, deve ser URL válida se fornecida

**Response (200 OK):**

```json
{
  "id": "uuid-da-marca",
  "name": "Volkswagen Motors",
  "logo_url": "https://exemplo.com/vw-novo-logo.png",
  "created_at": "2025-10-03T12:00:00.000Z",
  "updated_at": "2025-10-03T15:00:00.000Z"
}
```

**Erros Possíveis:**

- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é admin
- `404 Not Found`: Marca não encontrada
- `409 Conflict`: Nome já usado por outra marca

---

### 4. Deletar Marca

**Rota:** `DELETE /api/brands/:id`

**Autenticação:** ✅ Requer token JWT (Bearer)

**Permissão:** Admin apenas

**Parâmetros de URL:**

- `id`: UUID da marca a ser deletada

**Response (200 OK):**

```json
{
  "message": "Marca deletada com sucesso",
  "id": "uuid-da-marca-deletada"
}
```

**Erros Possíveis:**

- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é admin
- `404 Not Found`: Marca não encontrada
- `409 Conflict`: Marca possui veículos cadastrados (não pode deletar)

**⚠️ IMPORTANTE:** Antes de deletar uma marca, verificar se não há veículos associados a ela. Se houver, retornar erro 409 com mensagem clara.

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `brands`

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para melhorar performance de busca
CREATE INDEX idx_brands_name ON brands(name);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔒 Segurança e Validações

### Middleware de Autenticação

```javascript
// Aplicar em todas as rotas exceto GET /api/brands
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Exemplo de uso
router.post("/brands", authenticateToken, requireAdmin, createBrand);
router.put("/brands/:id", authenticateToken, requireAdmin, updateBrand);
router.delete("/brands/:id", authenticateToken, requireAdmin, deleteBrand);
```

### Validações Recomendadas

#### Nome da Marca

- Não pode ser vazio
- Mínimo 2 caracteres
- Máximo 50 caracteres
- Apenas letras, números, espaços e hífen
- Trim de espaços extras
- Case-insensitive para verificação de duplicatas

#### Logo URL

- Opcional
- Se fornecida, deve ser URL válida
- Prefixo http:// ou https://
- Máximo 500 caracteres

### Exemplo de Validação (Node.js)

```javascript
function validateBrandData(data) {
  const errors = [];

  // Validar nome
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres");
  }
  if (data.name && data.name.length > 50) {
    errors.push("Nome não pode exceder 50 caracteres");
  }
  if (data.name && !/^[a-zA-Z0-9\s\-]+$/.test(data.name)) {
    errors.push("Nome contém caracteres inválidos");
  }

  // Validar logo_url
  if (data.logo_url && data.logo_url.trim()) {
    try {
      new URL(data.logo_url);
      if (!data.logo_url.startsWith("http")) {
        errors.push("URL da logo deve começar com http:// ou https://");
      }
    } catch {
      errors.push("URL da logo inválida");
    }
  }

  return errors;
}
```

---

## 🧪 Testes Recomendados

### 1. GET /api/brands

- ✅ Deve retornar array de marcas
- ✅ Deve funcionar sem autenticação
- ✅ Deve retornar array vazio se não houver marcas

### 2. POST /api/brands

- ✅ Deve criar marca com dados válidos
- ✅ Deve criar marca sem logo_url
- ❌ Deve falhar sem nome
- ❌ Deve falhar com nome duplicado
- ❌ Deve falhar sem token de autenticação
- ❌ Deve falhar se usuário não for admin
- ❌ Deve falhar com URL inválida

### 3. PUT /api/brands/:id

- ✅ Deve atualizar marca existente
- ✅ Deve atualizar apenas nome
- ✅ Deve atualizar apenas logo_url
- ✅ Deve remover logo_url (passar null ou string vazia)
- ❌ Deve falhar com ID inválido
- ❌ Deve falhar com marca inexistente
- ❌ Deve falhar com nome duplicado
- ❌ Deve falhar sem autenticação

### 4. DELETE /api/brands/:id

- ✅ Deve deletar marca sem veículos
- ❌ Deve falhar ao deletar marca com veículos
- ❌ Deve falhar com ID inválido
- ❌ Deve falhar com marca inexistente
- ❌ Deve falhar sem autenticação
- ❌ Deve falhar se usuário não for admin

---

## 📝 Exemplos de Uso (cURL)

### Listar Marcas

```bash
curl http://localhost:3001/api/brands
```

### Criar Marca

```bash
curl -X POST http://localhost:3001/api/brands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Ferrari",
    "logo_url": "https://exemplo.com/ferrari.png"
  }'
```

### Atualizar Marca

```bash
curl -X PUT http://localhost:3001/api/brands/uuid-da-marca \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Ferrari SpA",
    "logo_url": "https://exemplo.com/ferrari-novo.png"
  }'
```

### Deletar Marca

```bash
curl -X DELETE http://localhost:3001/api/brands/uuid-da-marca \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔄 Relacionamento com Veículos

### Constraint de Foreign Key

A tabela `vehicles` já deve ter uma constraint de foreign key:

```sql
ALTER TABLE vehicles
ADD CONSTRAINT fk_brand
FOREIGN KEY (brand_id)
REFERENCES brands(id)
ON DELETE RESTRICT; -- Impede deletar marca com veículos
```

### Query para Verificar se Marca Pode Ser Deletada

```sql
SELECT COUNT(*) as vehicle_count
FROM vehicles
WHERE brand_id = $1;

-- Se vehicle_count > 0, retornar erro 409
```

---

## 📊 Dados Iniciais (Seed)

Recomendado ter algumas marcas populares pré-cadastradas:

```sql
INSERT INTO brands (name, logo_url) VALUES
('Toyota', 'https://example.com/logos/toyota.png'),
('Honda', 'https://example.com/logos/honda.png'),
('Volkswagen', 'https://example.com/logos/vw.png'),
('Ford', 'https://example.com/logos/ford.png'),
('Chevrolet', 'https://example.com/logos/chevrolet.png'),
('Fiat', 'https://example.com/logos/fiat.png'),
('Nissan', 'https://example.com/logos/nissan.png'),
('Hyundai', 'https://example.com/logos/hyundai.png'),
('Jeep', 'https://example.com/logos/jeep.png'),
('Renault', 'https://example.com/logos/renault.png');
```

---

## 🚀 Checklist de Implementação

### Backend

- [ ] Criar tabela `brands` no banco de dados
- [ ] Implementar GET /api/brands (público)
- [ ] Implementar POST /api/brands (admin)
- [ ] Implementar PUT /api/brands/:id (admin)
- [ ] Implementar DELETE /api/brands/:id (admin)
- [ ] Adicionar validações de dados
- [ ] Adicionar middleware de autenticação
- [ ] Verificar constraint de foreign key em vehicles
- [ ] Testar todos os endpoints
- [ ] Adicionar dados seed (marcas iniciais)

### Frontend ✅ (Já Implementado)

- [x] Criar página BrandsAdmin.tsx
- [x] Adicionar rota /admin/brands
- [x] Link no Dashboard
- [x] Modal de criar/editar
- [x] Modal de confirmação de exclusão
- [x] Integração com toast notifications
- [x] Pré-visualização de logo

---

## 🎯 Fluxo de Trabalho

### Criar Marca

1. Admin acessa /admin/brands
2. Clica em "Nova Marca"
3. Preenche nome e URL da logo (opcional)
4. Clica em "Criar"
5. Frontend faz POST /api/brands
6. Backend valida e salva
7. Retorna marca criada
8. Frontend mostra toast de sucesso
9. Lista atualiza automaticamente

### Editar Marca

1. Admin clica em "Editar" na marca
2. Modal abre com dados atuais
3. Modifica nome e/ou logo
4. Clica em "Atualizar"
5. Frontend faz PUT /api/brands/:id
6. Backend valida e atualiza
7. Retorna marca atualizada
8. Frontend mostra toast de sucesso
9. Lista atualiza automaticamente

### Deletar Marca

1. Admin clica em "Excluir" na marca
2. Modal de confirmação abre
3. Admin confirma exclusão
4. Frontend faz DELETE /api/brands/:id
5. Backend verifica se há veículos
6. Se não houver, deleta a marca
7. Se houver, retorna erro 409
8. Frontend mostra toast apropriado
9. Lista atualiza se sucesso

---

## ⚠️ Observações Importantes

### 1. Logos

- As URLs das logos devem apontar para imagens hospedadas externamente
- Recomenda-se usar serviços como Cloudinary, AWS S3, ou similar
- Formato recomendado: PNG ou SVG com fundo transparente
- Tamanho recomendado: 200x200px a 400x400px

### 2. Nomes de Marcas

- Manter capitalização consistente (ex: "Toyota" não "TOYOTA")
- Não permitir duplicatas (case-insensitive)
- Trim de espaços antes e depois

### 3. Relacionamento com Veículos

- NUNCA permitir deletar marca que tenha veículos cadastrados
- Fornecer mensagem clara ao usuário sobre o motivo
- Sugerir remover/alterar veículos primeiro

### 4. Performance

- Índice no campo `name` para busca rápida
- Cache da lista de marcas (poucas mudanças)
- Paginação não necessária (poucas marcas)

---

**Documentação para Acessorauto Veículos** 🚗
_Backend API - Gerenciamento de Marcas_
_Data: 08/10/2025_
_Versão: 1.0_
