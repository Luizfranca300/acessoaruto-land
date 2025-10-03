# 🚗 Acessorauto Veículos - Frontend

Site institucional e catálogo de veículos para a Acessorauto Veículos em Uberlândia-MG.

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **API REST** - Backend separado (PostgreSQL)

## 🚀 Instalação

### 1. Pré-requisitos

- Node.js 18+ instalado
- API backend rodando (veja projeto `acessorauto-api`)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o .env com suas configurações
nano .env
```

**Variáveis importantes:**

- `VITE_API_URL` - URL da API backend (padrão: http://localhost:3001/api)
- `VITE_COMPANY_*` - Informações da empresa exibidas no site

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── Footer.tsx      # Rodapé com informações de contato
│   └── AcessorautoLogo.tsx  # Logotipo SVG
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Inventory.tsx   # Catálogo de veículos
│   ├── VehicleDetail.tsx   # Detalhes do veículo
│   ├── About.tsx       # Sobre a empresa
│   ├── SellCar.tsx     # Vender veículo
│   └── Financing.tsx   # Financiamento
├── lib/
│   ├── supabase.ts     # Tipos e interfaces
│   └── database.ts     # Cliente API REST
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada

public/                 # Arquivos estáticos
tailwind.config.js      # Configuração do Tailwind
```

## 🎨 Paleta de Cores

O projeto usa uma paleta de cores vermelha personalizada:

- **brand-600**: `#dc2626` - Vermelho principal
- **brand-700**: `#b91c1c` - Vermelho escuro
- **brand-800**: `#991b1b` - Vermelho mais escuro (header)
- **brand-900**: `#7f1d1d` - Vermelho muito escuro

## 📱 Funcionalidades

- ✅ Catálogo de veículos com filtros avançados
- ✅ Detalhes completos de cada veículo
- ✅ Formulários de contato e avaliação
- ✅ Simulador de financiamento
- ✅ Links diretos para WhatsApp
- ✅ Design responsivo (mobile/desktop)
- ✅ SEO otimizado

## 🔗 Dependências da API

Este frontend consome a API backend localizada em:
📁 `../acessorauto-api/`

**Certifique-se de que a API está rodando antes de iniciar o frontend!**

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run typecheck    # Verificar tipos TypeScript
```

## 🌐 Deploy

### Variáveis de ambiente em produção:

```env
VITE_API_URL=https://api.acessorauto.com.br/api
```

Certifique-se de atualizar a URL da API para o endereço de produção.

## 📞 Informações da Empresa

**Acessorauto Veículos**

- 📍 Av. João Pinheiro, 1722 - Nossa Sra. Aparecida, Uberlândia - MG
- 📞 (34) 3222-9303
- 📱 (34) 99998-9303
- 📧 contato@acessorauto.com.br

## 🐛 Problemas Comuns

### API não conecta

- Verifique se a API está rodando em `http://localhost:3001`
- Confirme que `VITE_API_URL` no `.env` está correto

### Imagens não aparecem

- Certifique-se de que as URLs das imagens no banco estão corretas
- Verifique se há veículos cadastrados com imagens

### Erro de CORS

- Configure `FRONTEND_URL` no `.env` da API
- Reinicie a API após alterar configurações

## 📄 Licença

Propriedade da Acessorauto Veículos © 2025
