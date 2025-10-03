# Implementação dos Endpoints de Configurações de Usuário - Backend

Este documento contém as instruções para implementar os endpoints necessários para permitir que os usuários alterem suas informações pessoais e senha na API localizada em `Documents/acessorauto-api`.

## Endpoints a Implementar

### 1. Atualizar Perfil do Usuário

**Endpoint:** `PUT /api/auth/profile`

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**

```json
{
  "name": "Novo Nome",
  "email": "novoemail@example.com"
}
```

**Resposta de Sucesso (200):**

```json
{
  "id": "uuid",
  "name": "Novo Nome",
  "email": "novoemail@example.com",
  "role": "admin"
}
```

**Validações:**

- Token deve ser válido
- Email deve ser único (se for alterado)
- Nome não pode ser vazio
- Email deve ter formato válido

**Possíveis Erros:**

- `401`: Token inválido ou ausente
- `400`: Email já está em uso
- `400`: Dados inválidos

---

### 2. Alterar Senha

**Endpoint:** `PUT /api/auth/password`

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**

```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Senha alterada com sucesso"
}
```

**Validações:**

- Token deve ser válido
- Senha atual deve estar correta
- Nova senha deve ter pelo menos 6 caracteres
- Nova senha deve ser diferente da senha atual

**Possíveis Erros:**

- `401`: Token inválido ou ausente
- `401`: Senha atual incorreta
- `400`: Nova senha inválida (muito curta)
- `400`: Nova senha igual à senha atual

---

## Exemplo de Implementação (Node.js/Express + PostgreSQL)

### Arquivo: `routes/auth.js`

```javascript
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db"); // Seu pool de conexão PostgreSQL

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// PUT /api/auth/profile - Atualizar perfil
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Validações
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Nome não pode ser vazio" });
    }

    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email já está em uso" });
      }
    }

    // Atualizar usuário
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role",
      [name, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
});

// PUT /api/auth/password - Alterar senha
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validações
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Senhas são obrigatórias" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Nova senha deve ter pelo menos 6 caracteres",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "Nova senha deve ser diferente da senha atual",
      });
    }

    // Buscar usuário com senha
    const userResult = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = userResult.rows[0];

    // Verificar senha atual
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha atual incorreta" });
    }

    // Gerar hash da nova senha
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [newPasswordHash, userId]
    );

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: "Erro ao alterar senha" });
  }
});

module.exports = router;
```

---

## Estrutura do Banco de Dados

Certifique-se de que a tabela `users` tenha as seguintes colunas:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testes

### 1. Testar Atualização de Perfil

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@example.com"
  }'
```

### 2. Testar Alteração de Senha

```bash
curl -X PUT http://localhost:3001/api/auth/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "currentPassword": "senhaAtual123",
    "newPassword": "novaSenha123"
  }'
```

---

## Checklist de Implementação

- [ ] Criar/atualizar rota `PUT /api/auth/profile`
- [ ] Criar/atualizar rota `PUT /api/auth/password`
- [ ] Implementar middleware de autenticação
- [ ] Adicionar validações de dados
- [ ] Verificar unicidade de email
- [ ] Implementar hash de senha com bcrypt
- [ ] Testar endpoints com Postman ou curl
- [ ] Adicionar tratamento de erros adequado
- [ ] Documentar os endpoints na API

---

## Dependências Necessárias

Certifique-se de que as seguintes dependências estão instaladas:

```json
{
  "dependencies": {
    "express": "^4.x.x",
    "bcrypt": "^5.x.x",
    "jsonwebtoken": "^9.x.x",
    "pg": "^8.x.x"
  }
}
```

---

## Observações

1. A constante `JWT_SECRET` deve estar definida nas variáveis de ambiente
2. Certifique-se de que o middleware de autenticação está sendo usado corretamente
3. Os endpoints devem retornar apenas os dados necessários (sem password_hash)
4. Adicione logs apropriados para debugging
5. Considere adicionar rate limiting para proteção contra ataques de força bruta
