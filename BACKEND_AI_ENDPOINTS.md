# 🔌 Backend API - IA e Busca de Veículos

## Endpoints para Implementar

Esta documentação detalha os endpoints necessários no backend para suportar o sistema de IA de descrição automática de veículos.

---

## 📍 Endpoint 1: Buscar Veículo por Placa

### `GET /api/vehicles/search-plate/:plate`

**Descrição:** Busca dados de um veículo através da placa

**Autenticação:** ✅ Bearer Token (JWT)

**Parâmetros de URL:**

- `plate` (string): Placa do veículo (aceita ABC1234 ou ABC-1234)

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200 (Sucesso):**

```json
{
  "brand": "Toyota",
  "model": "Corolla XEI 2.0 Flex",
  "year": 2020,
  "color": "Prata",
  "fuel_type": "flex",
  "transmission": "automático",
  "features": [
    "Ar-condicionado",
    "Direção elétrica",
    "Vidros elétricos",
    "Travas elétricas",
    "Multimídia",
    "Câmera de ré"
  ]
}
```

**Response 404 (Não Encontrado):**

```json
{
  "error": "Veículo não encontrado para esta placa"
}
```

**Response 401 (Não Autorizado):**

```json
{
  "error": "Token inválido ou ausente"
}
```

---

### Implementação Sugerida (Node.js/Express)

```javascript
// routes/vehicles.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// Controller
router.get("/search-plate/:plate", authenticateToken, async (req, res) => {
  try {
    const { plate } = req.params;

    // Limpar placa (remover hífen e espaços)
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    // Validar formato da placa
    if (cleanPlate.length < 7 || cleanPlate.length > 7) {
      return res.status(400).json({
        error: "Placa inválida. Use formato ABC1234 ou ABC1D23",
      });
    }

    // Opção 1: Buscar em banco de dados interno
    const dbVehicle = await db.query(
      `SELECT 
        b.name as brand,
        v.model,
        v.year,
        v.color,
        v.fuel_type,
        v.transmission,
        v.features
       FROM vehicle_database v
       JOIN brands b ON v.brand_id = b.id
       WHERE v.plate = $1`,
      [cleanPlate]
    );

    if (dbVehicle.rows.length > 0) {
      return res.json(dbVehicle.rows[0]);
    }

    // Opção 2: Buscar em API externa (se não encontrar no BD)
    const externalData = await searchExternalAPI(cleanPlate);

    if (externalData) {
      // Opcional: Salvar no BD para próximas consultas
      await cacheVehicleData(cleanPlate, externalData);
      return res.json(externalData);
    }

    // Não encontrado em nenhuma fonte
    return res.status(404).json({
      error: "Veículo não encontrado para esta placa",
    });
  } catch (error) {
    console.error("Erro ao buscar placa:", error);
    return res.status(500).json({
      error: "Erro ao processar busca",
    });
  }
});

// Função auxiliar para buscar em API externa
async function searchExternalAPI(plate) {
  try {
    // Exemplo com API Placa Fácil
    const response = await fetch(
      `https://api.placafacil.com.br/v1/placas/${plate}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PLACA_FACIL_TOKEN}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    // Mapear resposta da API para nosso formato
    return {
      brand: data.marca,
      model: data.modelo,
      year: data.anoModelo,
      color: data.cor,
      fuel_type: mapFuelType(data.combustivel),
      transmission: mapTransmission(data.cambio),
      features: suggestFeaturesByModel(data.modelo, data.anoModelo),
    };
  } catch (error) {
    console.error("Erro na API externa:", error);
    return null;
  }
}

// Função para mapear tipo de combustível
function mapFuelType(fuelFromAPI) {
  const map = {
    FLEX: "flex",
    GASOLINA: "gasolina",
    DIESEL: "diesel",
    ALCOOL: "álcool",
    ELETRICO: "elétrico",
    HIBRIDO: "híbrido",
  };
  return map[fuelFromAPI?.toUpperCase()] || "flex";
}

// Função para mapear tipo de câmbio
function mapTransmission(transmissionFromAPI) {
  const manual = ["MANUAL", "M"];
  const automatic = ["AUTOMATICO", "AUTOMÁTICA", "CVT", "A"];

  const trans = transmissionFromAPI?.toUpperCase();

  if (manual.some((t) => trans?.includes(t))) return "manual";
  if (automatic.some((t) => trans?.includes(t))) return "automático";

  return "manual";
}

// Função para sugerir características baseado no modelo/ano
function suggestFeaturesByModel(model, year) {
  const features = [];

  // Características básicas (todos os carros)
  features.push("Direção hidráulica", "Alarme");

  // Por ano
  if (year >= 2010) {
    features.push("Ar-condicionado", "Vidros elétricos", "Travas elétricas");
  }
  if (year >= 2015) {
    features.push("Direção elétrica", "Som", "Multimídia");
  }
  if (year >= 2018) {
    features.push("Bluetooth", "Câmera de ré", "Sensor de estacionamento");
  }
  if (year >= 2020) {
    features.push("Airbag", "ABS", "Controle de tração");
  }

  // Por modelo (versões mais completas)
  const upperModel = model.toUpperCase();
  if (
    upperModel.includes("XEI") ||
    upperModel.includes("EX") ||
    upperModel.includes("LIMITED") ||
    upperModel.includes("PREMIERE")
  ) {
    features.push("Bancos em couro", "Rodas de liga leve", "Faróis de neblina");
  }

  return [...new Set(features)]; // Remove duplicatas
}

module.exports = router;
```

---

## 📍 Endpoint 2: Gerar Descrição com IA

### `POST /api/ai/generate-description`

**Descrição:** Gera descrição profissional do veículo usando IA

**Autenticação:** ✅ Bearer Token (JWT)

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "brand": "Toyota",
  "model": "Corolla XEI",
  "year": 2020,
  "color": "Prata",
  "fuel_type": "flex",
  "transmission": "automático",
  "mileage": 45000,
  "features": ["Ar-condicionado", "Direção elétrica", "Vidros elétricos"]
}
```

**Response 200 (Sucesso):**

```json
{
  "description": "Corolla XEI 2020 em excelente estado! Este sedã médio combina conforto, economia e tecnologia. Motor flex 2.0 com câmbio automático CVT, proporcionando dirigibilidade suave e baixo consumo. Equipado com ar-condicionado digital, direção elétrica e completo pacote de segurança. Apenas 45 mil km, perfeito para quem busca um carro confiável e moderno. Pronto para ser seu!",
  "features": [
    "Ar-condicionado",
    "Direção elétrica",
    "Vidros elétricos",
    "Multimídia",
    "Airbag",
    "ABS",
    "Controle de tração",
    "Câmbio CVT"
  ]
}
```

**Response 400 (Dados Insuficientes):**

```json
{
  "error": "Dados insuficientes. Forneça pelo menos marca, modelo e ano."
}
```

**Response 500 (Erro na IA):**

```json
{
  "error": "Erro ao gerar descrição com IA"
}
```

---

### Implementação Sugerida (Node.js/Express + OpenAI)

```javascript
// routes/ai.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const { authenticateToken } = require("../middleware/auth");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-description", authenticateToken, async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      fuel_type,
      transmission,
      mileage,
      features,
    } = req.body;

    // Validar dados mínimos
    if (!brand || !model || !year) {
      return res.status(400).json({
        error: "Dados insuficientes. Forneça pelo menos marca, modelo e ano.",
      });
    }

    // Construir prompt para a IA
    const systemPrompt = `Você é um especialista em vendas de veículos automotivos no Brasil.
Sua tarefa é criar descrições persuasivas, profissionais e atraentes para anúncios de carros.

REGRAS IMPORTANTES:
1. Use linguagem profissional mas acessível
2. Destaque características únicas do modelo
3. Mencione benefícios práticos para o comprador
4. Inclua informações técnicas relevantes quando disponíveis
5. Crie senso de valor e urgência sutil
6. Mantenha tom positivo e confiável
7. Use entre 120-200 palavras
8. NÃO invente informações técnicas não fornecidas
9. Adapte ao público-alvo do veículo (popular, premium, SUV, etc.)
10. Seja honesto e transparente

FORMATO:
- Abertura chamativa com nome do veículo
- Características técnicas e equipamentos
- Benefícios e diferenciais
- Estado/quilometragem (se informado)
- Call-to-action final sutil`;

    const userPrompt = `Crie uma descrição de venda profissional para este veículo:

Marca: ${brand}
Modelo: ${model}
Ano: ${year}
${color ? `Cor: ${color}` : ""}
${fuel_type ? `Combustível: ${fuel_type}` : ""}
${transmission ? `Câmbio: ${transmission}` : ""}
${mileage ? `Quilometragem: ${mileage.toLocaleString("pt-BR")} km` : ""}
${
  features && features.length > 0
    ? `Características: ${features.join(", ")}`
    : ""
}

Crie uma descrição atraente e profissional que destaque os pontos fortes deste veículo.`;

    // Chamar API da OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const description = completion.choices[0].message.content;

    // Sugerir características adicionais baseado no veículo
    const suggestedFeatures = enhanceFeatures(features || [], {
      brand,
      model,
      year,
      transmission,
    });

    res.json({
      description,
      features: suggestedFeatures,
    });
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);

    if (error.code === "insufficient_quota") {
      return res.status(500).json({
        error: "Limite de uso da IA atingido. Tente novamente mais tarde.",
      });
    }

    return res.status(500).json({
      error: "Erro ao gerar descrição com IA",
    });
  }
});

// Função para enriquecer características
function enhanceFeatures(existingFeatures, vehicleData) {
  const enhanced = [...existingFeatures];
  const { brand, model, year, transmission } = vehicleData;

  // Características por ano
  if (year >= 2015 && !enhanced.includes("Multimídia")) {
    enhanced.push("Multimídia");
  }
  if (year >= 2018 && !enhanced.includes("Bluetooth")) {
    enhanced.push("Bluetooth");
  }
  if (year >= 2020) {
    if (!enhanced.includes("Airbag")) enhanced.push("Airbag");
    if (!enhanced.includes("ABS")) enhanced.push("ABS");
  }

  // Características por câmbio
  if (
    transmission === "automático" &&
    !enhanced.includes("Câmbio automático")
  ) {
    enhanced.push("Câmbio automático");
  }

  // Características por modelo (versões completas)
  const upperModel = model.toUpperCase();
  if (
    upperModel.includes("XEI") ||
    upperModel.includes("EX") ||
    upperModel.includes("LIMITED") ||
    upperModel.includes("PREMIERE")
  ) {
    if (!enhanced.includes("Bancos em couro")) enhanced.push("Bancos em couro");
    if (!enhanced.includes("Rodas de liga leve"))
      enhanced.push("Rodas de liga leve");
  }

  // Características por marca premium
  const premiumBrands = ["BMW", "MERCEDES", "AUDI", "PORSCHE", "LEXUS"];
  if (premiumBrands.includes(brand.toUpperCase())) {
    if (!enhanced.includes("Computador de bordo"))
      enhanced.push("Computador de bordo");
    if (!enhanced.includes("Controle de tração"))
      enhanced.push("Controle de tração");
  }

  return [...new Set(enhanced)]; // Remove duplicatas
}

module.exports = router;
```

---

### Alternativa: Implementação com Google Gemini (Gratuito)

```javascript
// routes/ai.js (versão Gemini)
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-description", authenticateToken, async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      fuel_type,
      transmission,
      mileage,
      features,
    } = req.body;

    if (!brand || !model || !year) {
      return res.status(400).json({
        error: "Dados insuficientes",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Você é um especialista em vendas de veículos. Crie uma descrição profissional e persuasiva de 120-200 palavras para:

Veículo: ${brand} ${model} ${year}
${color ? `Cor: ${color}` : ""}
${fuel_type ? `Combustível: ${fuel_type}` : ""}
${transmission ? `Câmbio: ${transmission}` : ""}
${mileage ? `Km: ${mileage.toLocaleString("pt-BR")}` : ""}
${features?.length > 0 ? `Itens: ${features.join(", ")}` : ""}

Use linguagem profissional, destaque benefícios, seja persuasivo mas honesto.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    const suggestedFeatures = enhanceFeatures(features || [], {
      brand,
      model,
      year,
      transmission,
    });

    res.json({
      description,
      features: suggestedFeatures,
    });
  } catch (error) {
    console.error("Erro Gemini:", error);
    res.status(500).json({ error: "Erro ao gerar descrição" });
  }
});
```

---

## 🗄️ Schema do Banco de Dados

### Tabela: `vehicle_database` (opcional - cache de placas)

```sql
CREATE TABLE vehicle_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(7) UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id),
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(30),
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  features TEXT[], -- Array de características
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_vehicle_db_plate ON vehicle_database(plate);
CREATE INDEX idx_vehicle_db_brand ON vehicle_database(brand_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_database_updated_at
BEFORE UPDATE ON vehicle_database
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔑 Variáveis de Ambiente Necessárias

### `.env`

```bash
# API de IA (escolher uma)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
# OU
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
# OU
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxx

# API de Placas (opcional)
PLACA_FACIL_TOKEN=xxxxxxxxxxxxxxxxxx
AUTO_AVALIAR_API_KEY=xxxxxxxxxxxxxxxxxx

# Configurações de IA
AI_MODEL=gpt-4  # ou gemini-pro, claude-3-sonnet
AI_MAX_TOKENS=500
AI_TEMPERATURE=0.7
```

---

## 📦 Dependências NPM

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.20.0",
    "@google/generative-ai": "^0.1.3",
    "dotenv": "^16.3.1"
  }
}
```

### Instalação

```bash
# OpenAI
npm install openai

# Google Gemini (grátis)
npm install @google/generative-ai

# Anthropic Claude
npm install @anthropic-ai/sdk
```

---

## 🧪 Testando os Endpoints

### Teste 1: Buscar Placa

```bash
curl -X GET http://localhost:3001/api/vehicles/search-plate/ABC1234 \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta Esperada:**

```json
{
  "brand": "Toyota",
  "model": "Corolla XEI",
  "year": 2020,
  "color": "Prata",
  "fuel_type": "flex",
  "transmission": "automático",
  "features": ["Ar-condicionado", "Direção elétrica"]
}
```

### Teste 2: Gerar Descrição

```bash
curl -X POST http://localhost:3001/api/ai/generate-description \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla XEI",
    "year": 2020,
    "color": "Prata",
    "fuel_type": "flex",
    "transmission": "automático",
    "mileage": 45000,
    "features": ["Ar-condicionado", "Direção elétrica"]
  }'
```

**Resposta Esperada:**

```json
{
  "description": "Corolla XEI 2020 em excelente estado...",
  "features": ["Ar-condicionado", "Direção elétrica", "Multimídia", ...]
}
```

---

## 🚀 Como Adicionar ao Projeto

### 1. Criar Arquivos de Rotas

```bash
# No backend
touch routes/ai.js
touch routes/vehicleSearch.js
```

### 2. Adicionar ao `routes/index.js`

```javascript
const aiRoutes = require("./ai");
const vehicleSearchRoutes = require("./vehicleSearch");

// ... outras rotas

app.use("/api/ai", aiRoutes);
app.use("/api/vehicles", vehicleSearchRoutes);
```

### 3. Configurar Variáveis de Ambiente

```bash
# Adicionar ao .env
GEMINI_API_KEY=sua_chave_aqui
```

### 4. Instalar Dependências

```bash
npm install @google/generative-ai
```

### 5. Testar

```bash
# Iniciar servidor
npm start

# Em outro terminal, testar
curl -X POST http://localhost:3001/api/ai/generate-description \
  -H "Content-Type: application/json" \
  -d '{"brand":"Toyota","model":"Corolla","year":2020}'
```

---

## 📊 Custos e Limites

### OpenAI GPT-4

- **Custo**: ~$0.03 por descrição (150 tokens)
- **Limite**: Depende do plano
- **Qualidade**: ⭐⭐⭐⭐⭐

### Google Gemini

- **Custo**: **GRÁTIS** (até 60 req/min)
- **Limite**: 60 requests/minuto
- **Qualidade**: ⭐⭐⭐⭐

### Anthropic Claude

- **Custo**: ~$0.02 por descrição
- **Limite**: Depende do plano
- **Qualidade**: ⭐⭐⭐⭐⭐

**💡 Recomendação**: Começar com **Gemini (grátis)** e migrar para GPT-4 se precisar de qualidade superior.

---

## ✅ Checklist de Implementação

### Backend

- [ ] Criar rota `GET /api/vehicles/search-plate/:plate`
- [ ] Implementar busca em banco de dados local
- [ ] (Opcional) Integrar API externa de placas
- [ ] Criar rota `POST /api/ai/generate-description`
- [ ] Escolher e configurar API de IA (Gemini/GPT/Claude)
- [ ] Implementar função `enhanceFeatures()`
- [ ] Adicionar middleware de autenticação
- [ ] Configurar variáveis de ambiente
- [ ] Testar endpoints
- [ ] Adicionar tratamento de erros

### Frontend ✅

- [x] Interface de busca por placa
- [x] Botão de geração de descrição
- [x] Toast notifications
- [x] Pré-preenchimento de formulário

---

**Pronto para implementar!** 🚀  
_Documentação Backend - Sistema de IA_  
_Data: 08/10/2025_
