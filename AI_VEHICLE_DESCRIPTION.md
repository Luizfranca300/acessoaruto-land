# 🤖 Sistema de IA - Descrição Automática de Veículos

## 📋 Visão Geral

Sistema inteligente que utiliza IA para **preencher automaticamente** os dados do veículo pela placa e **gerar descrições profissionais** para anúncios de vendas.

---

## ✨ Funcionalidades

### 1. **Busca Inteligente por Placa** 🔍

- **Entrada**: Placa do veículo (ABC-1234 ou ABC1D23)
- **Processamento**: Busca em base de dados de veículos
- **Saída**: Dados completos pré-preenchidos

**Dados Preenchidos Automaticamente:**

- ✅ Marca (auto-selecionada no dropdown)
- ✅ Modelo
- ✅ Ano de fabricação
- ✅ Cor
- ✅ Tipo de combustível
- ✅ Características sugeridas (quando disponível)

### 2. **Geração de Descrição com IA** ✨

- **Entrada**: Dados do veículo (marca, modelo, ano, etc.)
- **Processamento**: IA analisa e cria texto profissional
- **Saída**: Descrição otimizada para vendas

**Características da Descrição IA:**

- 📝 Linguagem persuasiva e profissional
- 🎯 Destaque para pontos fortes do veículo
- 💡 Sugestão de características relevantes
- 🚗 Contexto de mercado e público-alvo

---

## 🎨 Interface do Usuário

### Card de Busca Inteligente (Roxo/Purple)

```
┌─────────────────────────────────────────────┐
│  ✨ Preenchimento Inteligente com IA        │
│  Digite a placa para buscar dados e gerar   │
│  descrição automaticamente                   │
│                                              │
│  [ABC-1234    ] [🔍 Buscar]                 │
│                                              │
│  ✓ Marca e Modelo  ✓ Ano e Cor              │
│  ✓ Características ✨ Descrição com IA      │
│                                              │
│  [✨ Ou gerar apenas descrição com IA]      │
└─────────────────────────────────────────────┘
```

**Visual:**

- 🟣 Gradiente roxo (purple-600 to purple-700)
- ✨ Ícone Sparkles (varinha mágica)
- 🔍 Ícone Search (lupa)
- 💫 Efeitos de blur decorativos
- 🏷️ Tags de recursos incluídos

---

## 🔗 Endpoints Backend Necessários

### 1. Buscar Veículo por Placa

**Rota:** `GET /api/vehicles/search-plate/:plate`

**Autenticação:** ✅ Requer token JWT (Bearer)

**Parâmetros de URL:**

- `plate`: Placa do veículo (ABC1234 ou ABC-1234)

**Response (200 OK):**

```json
{
  "brand": "Toyota",
  "model": "Corolla XEI",
  "year": 2020,
  "color": "Prata",
  "fuel_type": "flex",
  "transmission": "automático",
  "features": [
    "Ar-condicionado",
    "Direção elétrica",
    "Vidros elétricos",
    "Multimídia"
  ]
}
```

**Erros:**

- `404 Not Found`: Veículo não encontrado para esta placa
- `401 Unauthorized`: Token inválido

---

### 2. Gerar Descrição com IA

**Rota:** `POST /api/ai/generate-description`

**Autenticação:** ✅ Requer token JWT (Bearer)

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

**Response (200 OK):**

```json
{
  "description": "Corolla XEI 2020 em excelente estado de conservação! Este sedã médio combina conforto, economia e tecnologia em um único veículo. Motor flex 2.0 com câmbio automático CVT, proporcionando dirigibilidade suave e baixo consumo. Equipado com ar-condicionado digital, multimídia com Apple CarPlay/Android Auto, direção elétrica progressiva e completo pacote de segurança. Perfeito para quem busca um carro confiável e moderno para o dia a dia. Única dona, revisões em dia na concessionária. Pronto para ser seu!",
  "features": [
    "Ar-condicionado digital",
    "Direção elétrica",
    "Vidros elétricos",
    "Multimídia",
    "Câmbio CVT",
    "Airbag",
    "ABS",
    "Controle de tração"
  ]
}
```

**Campos da Response:**

- `description` (string): Descrição completa gerada pela IA (150-300 palavras)
- `features` (array): Características sugeridas pela IA com base no modelo

**Erros:**

- `400 Bad Request`: Dados insuficientes para gerar descrição
- `500 Internal Server Error`: Erro na API de IA

---

## 🤖 Integração com IA (Backend)

### Opções de APIs de IA

#### 1. **OpenAI GPT-4** (Recomendado)

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content:
        "Você é um especialista em vendas de veículos. Crie descrições persuasivas e profissionais.",
    },
    {
      role: "user",
      content: `Crie uma descrição de venda para: ${JSON.stringify(
        vehicleData
      )}`,
    },
  ],
  temperature: 0.7,
  max_tokens: 500,
});
```

#### 2. **Anthropic Claude** (Alternativa)

```javascript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 500,
  messages: [
    {
      role: "user",
      content: `Crie uma descrição profissional de venda para este veículo: ${JSON.stringify(
        vehicleData
      )}`,
    },
  ],
});
```

#### 3. **Google Gemini** (Gratuito)

```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `Crie uma descrição de venda profissional para: ${JSON.stringify(
  vehicleData
)}`;
const result = await model.generateContent(prompt);
```

#### 4. **Ollama (Local/Gratuito)**

```javascript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({
    model: "llama3",
    prompt: `Crie descrição de venda para: ${JSON.stringify(vehicleData)}`,
  }),
});
```

---

## 📊 Prompt Engineering para IA

### Prompt Recomendado

```javascript
const systemPrompt = `Você é um especialista em vendas de veículos automotivos no Brasil.
Sua tarefa é criar descrições persuasivas, profissionais e atraentes para anúncios de carros.

REGRAS:
1. Use linguagem profissional mas acessível
2. Destaque características únicas do modelo
3. Mencione benefícios práticos para o comprador
4. Inclua informações técnicas relevantes
5. Crie senso de urgência sutil
6. Mantenha tom positivo e confiável
7. Use entre 150-300 palavras
8. Não invente informações não fornecidas
9. Adapte ao público-alvo do veículo

FORMATO:
- Parágrafo introdutório chamativo
- Detalhes técnicos e equipamentos
- Benefícios e diferenciais
- Estado de conservação (se informado)
- Call-to-action final`;

const userPrompt = `Crie uma descrição de venda para este veículo:

Marca: ${brand}
Modelo: ${model}
Ano: ${year}
Cor: ${color}
Combustível: ${fuel_type}
Câmbio: ${transmission}
Quilometragem: ${mileage} km
Características: ${features.join(", ")}

Crie uma descrição atraente e profissional.`;
```

---

## 🔄 Fluxo de Trabalho Completo

### Cenário 1: Busca por Placa + IA

```
1. Admin acessa "Adicionar Veículo"
   ↓
2. Vê card roxo "Preenchimento Inteligente"
   ↓
3. Digite placa: "ABC-1234"
   ↓
4. Clica "Buscar" 🔍
   ↓
5. Frontend chama GET /api/vehicles/search-plate/ABC1234
   ↓
6. Backend busca em base de dados (FIPE, Detran, etc.)
   ↓
7. Retorna dados do veículo
   ↓
8. Frontend preenche formulário automaticamente
   ↓
9. Frontend chama POST /api/ai/generate-description
   ↓
10. Backend usa IA (GPT-4/Claude/Gemini)
   ↓
11. IA gera descrição profissional
   ↓
12. Frontend preenche campo "Descrição"
   ↓
13. Toast: "Descrição gerada com IA! ✨"
   ↓
14. Admin revisa e ajusta se necessário
   ↓
15. Clica "Cadastrar Veículo"
   ↓
16. 🎉 Veículo cadastrado com descrição IA!
```

### Cenário 2: Gerar Apenas Descrição

```
1. Admin preenche dados manualmente
   ↓
2. Clica "Ou gerar apenas descrição com IA"
   ↓
3. Frontend coleta dados do formulário
   ↓
4. Chama POST /api/ai/generate-description
   ↓
5. IA analisa dados e gera descrição
   ↓
6. Descrição aparece no campo
   ↓
7. Admin pode editar e salvar
```

---

## 🗄️ Fonte de Dados de Placas

### Opções de APIs Públicas/Pagas

#### 1. **API FIPE** (Gratuita - Tabela de Preços)

```bash
GET https://parallelum.com.br/fipe/api/v1/carros/marcas
```

- ✅ Gratuita
- ✅ Dados oficiais FIPE
- ❌ Não busca por placa

#### 2. **API Placa Fácil** (Paga)

```bash
GET https://api.placafacil.com.br/v1/placas/{placa}
Headers: Authorization: Bearer TOKEN
```

- ✅ Busca por placa
- ✅ Dados completos do veículo
- ❌ R$ 0,10 por consulta

#### 3. **API Auto Avaliar** (Paga)

```bash
POST https://api.autoavaliar.com.br/veiculo/consultar
Body: { "placa": "ABC1234" }
```

- ✅ Dados detalhados
- ✅ Histórico do veículo
- ❌ Planos a partir de R$ 100/mês

#### 4. **Banco de Dados Interno** (Implementar)

```sql
CREATE TABLE vehicle_database (
  id UUID PRIMARY KEY,
  plate VARCHAR(8) UNIQUE NOT NULL,
  brand VARCHAR(50),
  model VARCHAR(100),
  year INT,
  color VARCHAR(30),
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 💡 Exemplo de Implementação Backend

### Controller: `/api/vehicles/search-plate/:plate`

```javascript
// controllers/vehicleSearchController.js
const searchVehicleByPlate = async (req, res) => {
  try {
    const { plate } = req.params;
    const cleanPlate = plate.replace(/[^A-Z0-9]/g, "");

    // Opção 1: Buscar em banco interno
    let vehicle = await db.query(
      "SELECT * FROM vehicle_database WHERE plate = $1",
      [cleanPlate]
    );

    // Opção 2: Buscar em API externa se não encontrar
    if (!vehicle.rows[0]) {
      const apiResponse = await fetch(
        `https://api.placafacil.com.br/v1/placas/${cleanPlate}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PLACA_FACIL_TOKEN}`,
          },
        }
      );

      const apiData = await apiResponse.json();

      vehicle = {
        brand: apiData.marca,
        model: apiData.modelo,
        year: apiData.ano,
        color: apiData.cor,
        fuel_type: apiData.combustivel,
        transmission: apiData.cambio,
      };
    }

    res.json(vehicle.rows[0] || vehicle);
  } catch (error) {
    res.status(404).json({ error: "Veículo não encontrado" });
  }
};
```

### Controller: `/api/ai/generate-description`

```javascript
// controllers/aiDescriptionController.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateDescription = async (req, res) => {
  try {
    const vehicleData = req.body;

    const prompt = `Crie uma descrição profissional de venda para:
    
Marca: ${vehicleData.brand}
Modelo: ${vehicleData.model}
Ano: ${vehicleData.year}
Cor: ${vehicleData.color}
Combustível: ${vehicleData.fuel_type}
Câmbio: ${vehicleData.transmission}
Km: ${vehicleData.mileage}
Características: ${vehicleData.features?.join(", ")}

Crie uma descrição persuasiva de 150-300 palavras.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em vendas de veículos.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const description = completion.choices[0].message.content;

    // Sugerir características com base no modelo/ano
    const suggestedFeatures = suggestFeatures(vehicleData);

    res.json({
      description,
      features: suggestedFeatures,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar descrição" });
  }
};

function suggestFeatures(vehicleData) {
  const features = [];

  // Características por ano
  if (vehicleData.year >= 2015) {
    features.push("Multimídia", "Bluetooth", "Câmera de ré");
  }
  if (vehicleData.year >= 2020) {
    features.push("Apple CarPlay", "Android Auto");
  }

  // Características por tipo de veículo
  if (vehicleData.model.includes("XEI") || vehicleData.model.includes("EX")) {
    features.push("Bancos em couro", "Rodas de liga leve");
  }

  return [...new Set(features)];
}
```

---

## 🔐 Variáveis de Ambiente

```env
# .env do Backend

# API de Placas
PLACA_FACIL_TOKEN=seu_token_aqui
AUTO_AVALIAR_API_KEY=sua_chave_aqui

# API de IA
OPENAI_API_KEY=sk-proj-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
GEMINI_API_KEY=xxxxx

# Configurações
AI_MODEL=gpt-4  # ou claude-3-sonnet, gemini-pro
MAX_TOKENS=500
TEMPERATURE=0.7
```

---

## 📊 Custos Estimados

### APIs de Placas

| Serviço       | Custo por Consulta | Custo Mensal (100 consultas) |
| ------------- | ------------------ | ---------------------------- |
| Placa Fácil   | R$ 0,10            | R$ 10,00                     |
| Auto Avaliar  | Plano R$ 100/mês   | R$ 100,00                    |
| Banco Interno | R$ 0,00            | R$ 0,00                      |

### APIs de IA

| Serviço        | Custo por Descrição | Custo Mensal (100 descrições) |
| -------------- | ------------------- | ----------------------------- |
| GPT-4          | ~R$ 0,15            | ~R$ 15,00                     |
| Claude 3       | ~R$ 0,10            | ~R$ 10,00                     |
| Gemini         | R$ 0,00 (grátis)    | R$ 0,00                       |
| Ollama (local) | R$ 0,00             | R$ 0,00                       |

**💡 Recomendação Econômica:**

- Banco interno de placas + Gemini/Ollama = **R$ 0,00/mês** 🎉

---

## 🎯 Benefícios do Sistema

### Para o Admin

- ⚡ **Velocidade**: Cadastro 10x mais rápido
- ✍️ **Qualidade**: Descrições profissionais sempre
- 🎨 **Consistência**: Padrão de escrita uniforme
- 📈 **Produtividade**: Mais veículos cadastrados/dia

### Para o Cliente

- 📝 **Informação Completa**: Descrições detalhadas
- 🎯 **Clareza**: Informações organizadas
- 💡 **Confiança**: Texto profissional
- 🚗 **Decisão Melhor**: Dados completos para escolha

### Para a Empresa

- 💰 **Mais Vendas**: Anúncios mais atrativos
- ⭐ **Imagem**: Profissionalismo nos anúncios
- 📊 **SEO**: Descrições ricas melhoram busca
- 🤝 **Conversão**: Taxa de conversão maior

---

## 🚀 Roadmap de Melhorias

### Fase 1 (Atual) ✅

- [x] Interface de busca por placa
- [x] Botão de geração de descrição IA
- [x] Toast notifications
- [x] Pré-preenchimento de formulário

### Fase 2 (Próxima) 🔄

- [ ] Implementar backend de busca por placa
- [ ] Integrar API de IA (Gemini/GPT)
- [ ] Sugestão inteligente de características
- [ ] Histórico de descrições geradas

### Fase 3 (Futuro) 🔮

- [ ] Múltiplas variações de descrição
- [ ] Otimização SEO automática
- [ ] Análise de sentimento da descrição
- [ ] Sugestão de preço baseado em mercado
- [ ] Comparação com anúncios similares
- [ ] Geração de títulos atrativos

---

## 🆘 Troubleshooting

### Problema: "Veículo não encontrado"

**Causa**: Placa não existe em base de dados
**Solução**:

1. Verificar se placa está correta
2. Tentar formato alternativo (ABC1234 ou ABC-1234)
3. Preencher dados manualmente

### Problema: "Erro ao gerar descrição"

**Causa**: API de IA indisponível ou sem créditos
**Solução**:

1. Verificar chave de API
2. Verificar saldo de créditos
3. Usar API alternativa (Gemini grátis)
4. Escrever descrição manual

### Problema: Botão "Buscar" desabilitado

**Causa**: Placa não digitada
**Solução**: Digite a placa do veículo primeiro

### Problema: Descrição genérica demais

**Causa**: Poucos dados fornecidos à IA
**Solução**:

1. Preencher mais campos antes de gerar
2. Adicionar características manualmente
3. Editar descrição gerada

---

## 📝 Exemplos de Descrições Geradas

### Exemplo 1: Sedan Popular

**Input:**

```
Marca: Toyota
Modelo: Corolla XEI
Ano: 2020
Cor: Prata
Combustível: Flex
Câmbio: Automático
Km: 45.000
```

**Output IA:**

> "Corolla XEI 2020 em estado impecável! Este sedã médio é referência em confiabilidade e conforto. Equipado com motor 2.0 flex e câmbio automático CVT, oferece dirigibilidade suave e economia exemplar. Completo com ar-condicionado digital, multimídia touch com conectividade, direção elétrica progressiva e amplo pacote de segurança. Interior espaçoso com acabamento refinado, perfeito para família. Apenas 45 mil km rodados, única dona, todas as revisões em concessionária. Documentação em dia, aceita financiamento. Agende já seu test-drive!"

### Exemplo 2: SUV Premium

**Input:**

```
Marca: Jeep
Modelo: Compass Limited
Ano: 2021
Cor: Branco
Combustível: Diesel
Câmbio: Automático
Km: 30.000
```

**Output IA:**

> "Compass Limited 2021 - SUV premium que une robustez e sofisticação! Motor turbo diesel 2.0 4x4, ideal para quem busca performance e economia. Interior em couro premium, teto panorâmico, multimídia Uconnect de 8.4", som Beats, câmeras 360°, sensores de estacionamento e muito mais. Baixíssima quilometragem (30mil km), revisões em dia, único dono. Perfeito estado de conservação. Pronto para aventuras on-road e off-road. Aceita seu usado como parte do pagamento!"

---

## 📚 Referências e Links Úteis

### APIs de IA

- [OpenAI GPT-4](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude](https://docs.anthropic.com/claude/reference/getting-started)
- [Google Gemini](https://ai.google.dev/docs)
- [Ollama Local](https://ollama.ai/docs)

### APIs de Veículos

- [FIPE API](https://deividfortuna.github.io/fipe/)
- [Placa Fácil](https://www.placafacil.com.br/api)
- [Auto Avaliar](https://autoavaliar.com.br/api)

### Documentação Técnica

- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Desenvolvido para Acessorauto Veículos** 🚗  
_Sistema de IA - Descrição Automática_  
_Data: 08/10/2025_  
_Versão: 1.0_
