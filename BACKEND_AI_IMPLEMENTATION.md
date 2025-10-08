# 🤖 Implementação da IA no Backend - Geração de Descrição

## 📋 Visão Geral

Sistema simplificado que **gera descrições profissionais** de veículos usando IA, baseado nos dados preenchidos no formulário.

**Fluxo:**

1. Frontend envia dados do veículo (marca, modelo, ano, cor, etc.)
2. Backend processa e cria prompt inteligente
3. IA (Gemini/GPT-4) gera descrição profissional
4. Backend retorna descrição formatada

---

## 🔧 1. Instalação de Dependências

### Opção A: Google Gemini (RECOMENDADO - GRÁTIS)

```bash
cd /Users/luiz/Documents/acessorauto-api
npm install @google/generative-ai
```

### Opção B: OpenAI GPT-4 (PAGO - Melhor qualidade)

```bash
cd /Users/luiz/Documents/acessorauto-api
npm install openai
```

---

## 🔑 2. Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# IA - Escolha UMA das opções abaixo

# Opção A: Google Gemini (Grátis)
GOOGLE_API_KEY=sua-chave-aqui
# Obter em: https://makersuite.google.com/app/apikey

# Opção B: OpenAI GPT-4 (Pago - ~R$0.15/descrição)
OPENAI_API_KEY=sua-chave-aqui
# Obter em: https://platform.openai.com/api-keys
```

---

## 📁 3. Criar Arquivo de Serviço da IA

Crie: `/src/services/aiService.js`

### Opção A: Google Gemini (GRÁTIS)

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateVehicleDescription(vehicleData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construir prompt inteligente
    const prompt = `
Você é um especialista em vendas de veículos. Crie uma descrição PROFISSIONAL e ATRAENTE para este veículo:

**DADOS DO VEÍCULO:**
- Marca: ${vehicleData.brand || "Não informado"}
- Modelo: ${vehicleData.model || "Não informado"}
- Ano: ${vehicleData.year || "Não informado"}
- Cor: ${vehicleData.color || "Não informado"}
- Combustível: ${vehicleData.fuel_type || "Não informado"}
- Transmissão: ${vehicleData.transmission || "Não informado"}
- Quilometragem: ${
      vehicleData.mileage ? vehicleData.mileage + " km" : "Não informado"
    }
- Características: ${
      vehicleData.features && vehicleData.features.length > 0
        ? vehicleData.features.join(", ")
        : "Nenhuma informada"
    }

**INSTRUÇÕES:**
1. Escreva em português brasileiro, tom profissional mas persuasivo
2. Destaque os principais atrativos do veículo
3. Mencione as características especiais (se houver)
4. Use 2-3 parágrafos curtos e objetivos
5. Termine com um call-to-action convidativo
6. NÃO invente informações que não foram fornecidas
7. NÃO mencione preço
8. Tamanho: entre 150-250 palavras

**DESCRIÇÃO:**`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const description = response.text().trim();

    return {
      success: true,
      description: description,
      features: vehicleData.features || [], // Retorna as features que já existem
    };
  } catch (error) {
    console.error("Erro ao gerar descrição com Gemini:", error);
    throw new Error("Falha ao gerar descrição com IA");
  }
}

module.exports = { generateVehicleDescription };
```

### Opção B: OpenAI GPT-4 (PAGO)

```javascript
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateVehicleDescription(vehicleData) {
  try {
    const prompt = `
Você é um especialista em vendas de veículos. Crie uma descrição PROFISSIONAL e ATRAENTE para este veículo:

**DADOS DO VEÍCULO:**
- Marca: ${vehicleData.brand || "Não informado"}
- Modelo: ${vehicleData.model || "Não informado"}
- Ano: ${vehicleData.year || "Não informado"}
- Cor: ${vehicleData.color || "Não informado"}
- Combustível: ${vehicleData.fuel_type || "Não informado"}
- Transmissão: ${vehicleData.transmission || "Não informado"}
- Quilometragem: ${
      vehicleData.mileage ? vehicleData.mileage + " km" : "Não informado"
    }
- Características: ${
      vehicleData.features && vehicleData.features.length > 0
        ? vehicleData.features.join(", ")
        : "Nenhuma informada"
    }

**INSTRUÇÕES:**
1. Escreva em português brasileiro, tom profissional mas persuasivo
2. Destaque os principais atrativos do veículo
3. Mencione as características especiais (se houver)
4. Use 2-3 parágrafos curtos e objetivos
5. Termine com um call-to-action convidativo
6. NÃO invente informações que não foram fornecidas
7. NÃO mencione preço
8. Tamanho: entre 150-250 palavras`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em criar descrições atraentes para veículos usados.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const description = completion.choices[0].message.content.trim();

    return {
      success: true,
      description: description,
      features: vehicleData.features || [],
    };
  } catch (error) {
    console.error("Erro ao gerar descrição com OpenAI:", error);
    throw new Error("Falha ao gerar descrição com IA");
  }
}

module.exports = { generateVehicleDescription };
```

---

## 🛣️ 4. Criar Rota da API

Crie ou edite: `/src/routes/aiRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth"); // Seu middleware de autenticação
const { generateVehicleDescription } = require("../services/aiService");

/**
 * POST /api/ai/generate-description
 * Gera descrição profissional do veículo usando IA
 */
router.post("/generate-description", authenticateToken, async (req, res) => {
  try {
    const vehicleData = req.body;

    // Validação básica
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.year) {
      return res.status(400).json({
        success: false,
        message: "Marca, modelo e ano são obrigatórios",
      });
    }

    // Gerar descrição com IA
    const result = await generateVehicleDescription(vehicleData);

    return res.status(200).json({
      success: true,
      description: result.description,
      features: result.features,
      message: "Descrição gerada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao gerar descrição com IA",
      error: error.message,
    });
  }
});

module.exports = router;
```

---

## 🔗 5. Registrar Rota no App Principal

Edite: `/src/app.js` ou `/src/server.js` ou `/src/index.js`

```javascript
const express = require("express");
const app = express();

// ... outros imports e configurações

// Importar rotas da IA
const aiRoutes = require("./routes/aiRoutes");

// ... outras rotas
// const vehicleRoutes = require('./routes/vehicleRoutes');
// const brandRoutes = require('./routes/brandRoutes');

// Registrar rotas
app.use("/api/ai", aiRoutes); // <-- ADICIONAR ESTA LINHA
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/brands', brandRoutes);

// ... resto do código
```

---

## 🧪 6. Testar o Endpoint

### Teste com cURL:

```bash
curl -X POST http://localhost:3001/api/ai/generate-description \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "year": "2020",
    "color": "Prata",
    "fuel_type": "Flex",
    "transmission": "Automático",
    "mileage": "45000",
    "features": ["Ar condicionado", "Direção elétrica", "Vidros elétricos"]
  }'
```

### Teste com Postman/Insomnia:

**URL:** `POST http://localhost:3001/api/ai/generate-description`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

**Body (JSON):**

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": "2020",
  "color": "Prata",
  "fuel_type": "Flex",
  "transmission": "Automático",
  "mileage": "45000",
  "features": ["Ar condicionado", "Direção elétrica", "Vidros elétricos"]
}
```

### Resposta Esperada:

```json
{
  "success": true,
  "description": "Apresentamos este magnífico Toyota Corolla 2020, na elegante cor Prata. Com apenas 45.000 km rodados, este veículo combina economia e conforto em um único pacote.\n\nEquipado com motor Flex, transmissão automática e recursos como ar condicionado, direção elétrica e vidros elétricos, este Corolla oferece uma experiência de condução suave e tecnológica. Ideal para quem busca um carro confiável e com ótimo custo-benefício.\n\nAgende hoje mesmo um test-drive e comprove a qualidade e performance deste excepcional Toyota Corolla!",
  "features": ["Ar condicionado", "Direção elétrica", "Vidros elétricos"],
  "message": "Descrição gerada com sucesso"
}
```

---

## 💰 7. Custos e Limites

### Google Gemini (RECOMENDADO)

- ✅ **GRÁTIS** até 60 requisições/minuto
- ✅ **15 requisições/minuto** no plano gratuito
- ✅ Qualidade excelente para descrições
- ✅ Sem necessidade de cartão de crédito inicial
- 📊 **Custo:** R$ 0,00/mês para uso normal

### OpenAI GPT-4

- 💳 **PAGO** desde o início
- 💰 ~**$0.03 USD** por descrição (~R$ 0,15)
- 💰 ~**R$ 150/mês** para 1.000 descrições
- ⭐ Qualidade superior (melhor redação)
- 📊 **Custo:** Variável conforme uso

---

## 🔒 8. Segurança e Boas Práticas

### ✅ Implementado:

- ✅ Autenticação JWT obrigatória
- ✅ Validação de dados de entrada
- ✅ API Key no backend (não exposta ao frontend)
- ✅ Tratamento de erros

### 📋 Recomendações Adicionais:

1. **Rate Limiting** - Limitar requisições por usuário:

```javascript
const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requisições por IP
  message: "Muitas requisições de IA. Tente novamente em 15 minutos.",
});

router.post(
  "/generate-description",
  aiLimiter,
  authenticateToken,
  async (req, res) => {
    // ...
  }
);
```

2. **Cache de Descrições** - Evitar gerar mesma descrição:

```javascript
// Verificar se já existe descrição similar no banco
const existingVehicle = await db.query(
  "SELECT description FROM vehicles WHERE brand_id = $1 AND model = $2 AND year = $3 LIMIT 1",
  [vehicleData.brand, vehicleData.model, vehicleData.year]
);

if (existingVehicle.rows.length > 0) {
  return res.json({
    success: true,
    description: existingVehicle.rows[0].description,
    cached: true,
  });
}
```

3. **Logging** - Registrar uso da IA:

```javascript
// Salvar log de uso
await db.query(
  "INSERT INTO ai_usage_logs (user_id, vehicle_data, tokens_used, created_at) VALUES ($1, $2, $3, NOW())",
  [req.user.id, JSON.stringify(vehicleData), tokensUsed]
);
```

---

## 🚀 9. Checklist de Implementação

### Backend:

- [ ] Instalar dependência (`@google/generative-ai` ou `openai`)
- [ ] Adicionar API Key no `.env`
- [ ] Criar arquivo `/src/services/aiService.js`
- [ ] Criar arquivo `/src/routes/aiRoutes.js`
- [ ] Registrar rota no app principal
- [ ] Testar endpoint com Postman/cURL
- [ ] Implementar rate limiting (opcional)
- [ ] Adicionar logs de uso (opcional)

### Frontend:

- [x] ✅ Função `generateAIDescription()` implementada
- [x] ✅ Botão "Gerar com IA" ao lado do campo descrição
- [x] ✅ Toast de sucesso/erro
- [x] ✅ Validação de campos obrigatórios (marca, modelo, ano)
- [x] ✅ UI simples e intuitiva (sem card grande)

---

## 📊 10. Exemplo de Resposta da IA

### Entrada:

```json
{
  "brand": "Volkswagen",
  "model": "Golf GTI",
  "year": "2019",
  "color": "Preto",
  "fuel_type": "Gasolina",
  "transmission": "Manual",
  "mileage": "32000",
  "features": [
    "Teto solar",
    "Bancos em couro",
    "Sistema de som premium",
    "Rodas de liga leve"
  ]
}
```

### Saída (Gemini):

```json
{
  "success": true,
  "description": "Esportividade e elegância se encontram neste impressionante Volkswagen Golf GTI 2019, na sofisticada cor Preta. Com apenas 32.000 km rodados e em excelente estado de conservação, este veículo foi feito para quem aprecia performance e estilo.\n\nDestaque para o teto solar panorâmico, bancos em couro legítimo, sistema de som premium que transforma cada viagem em uma experiência única, e rodas de liga leve que agregam ainda mais esportividade ao conjunto. A transmissão manual proporciona total controle e prazer ao dirigir.\n\nNão perca a oportunidade de ter um dos hatchbacks mais desejados do mercado. Entre em contato e agende seu test-drive hoje mesmo!",
  "features": [
    "Teto solar",
    "Bancos em couro",
    "Sistema de som premium",
    "Rodas de liga leve"
  ],
  "message": "Descrição gerada com sucesso"
}
```

---

## 🆘 11. Troubleshooting

### Erro: "API Key inválida"

- Verifique se adicionou a chave no `.env`
- Confirme que reiniciou o servidor após adicionar
- Teste a chave em: https://makersuite.google.com/ (Gemini)

### Erro: "Rate limit exceeded"

- Aguarde alguns minutos
- Verifique limites da API no console
- Considere upgrade do plano (se necessário)

### Erro: "Timeout"

- IA pode demorar 3-10 segundos
- Aumente timeout do servidor se necessário
- Adicione loading no frontend

### Descrição genérica demais

- Melhore o prompt com mais instruções
- Adicione exemplos no prompt
- Aumente temperatura (0.7 → 0.9) para mais criatividade

---

## 📝 12. Próximos Passos Opcionais

1. **Melhorar Prompt** - Adicionar mais contexto e exemplos
2. **Sugerir Características** - IA pode sugerir features com base na marca/modelo
3. **Múltiplos Idiomas** - Gerar em PT-BR, EN, ES
4. **Otimizar SEO** - IA pode sugerir keywords
5. **Variar Descrições** - Gerar 3 opções para escolher
6. **Análise de Sentimento** - Verificar se descrição é positiva

---

## ✅ Conclusão

Com esta implementação, você terá:

- ✨ Geração automática de descrições profissionais
- 🔒 Sistema seguro no backend
- 💰 Custo zero (Gemini) ou controlado (GPT-4)
- 🚀 Pronto para produção

**Recomendação:** Comece com **Google Gemini** (grátis) e depois avalie migrar para GPT-4 se precisar de qualidade ainda maior.
