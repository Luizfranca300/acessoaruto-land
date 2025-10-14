# Guia de Link Preview - Open Graph

## 📋 O que foi implementado

Implementei um sistema completo de **link preview** com meta tags Open Graph para compartilhamento de veículos nas redes sociais (Facebook, Instagram, WhatsApp).

## 🎯 Funcionalidades

### 1. Meta Tags Open Graph
- **Título**: Nome completo do veículo (Marca + Modelo + Ano)
- **Descrição**: Detalhes do veículo (combustível, km, preço)
- **Imagem**: Primeira foto do veículo
- **URL**: Link direto para a página do veículo

### 2. Botão de Compartilhamento
- Localizado no topo da página de detalhes do veículo
- Menu com opções:
  - **WhatsApp**: Compartilha com texto personalizado
  - **Facebook**: Abre o Facebook Sharer
  - **Copiar Link**: Copia URL para área de transferência
  - Suporte nativo ao Web Share API (mobile)

## 🚀 Como usar

### Para instalar as dependências:
```bash
npm install
# ou
pnpm install
```

### Para testar localmente:
```bash
npm run dev
```

## 🧪 Como testar o Link Preview

### 1. Testar localmente (desenvolvimento)
⚠️ **IMPORTANTE**: Meta tags Open Graph só funcionam em produção com URLs públicas. Em desenvolvimento local, você não verá o preview nas redes sociais.

### 2. Testar em produção

#### Opção A: Facebook Sharing Debugger
1. Faça o deploy da aplicação
2. Acesse: https://developers.facebook.com/tools/debug/
3. Cole a URL do veículo (ex: `https://seusite.com/vehicle/123`)
4. Clique em "Debug" para ver como o Facebook renderiza
5. Use "Scrape Again" se fizer alterações

#### Opção B: WhatsApp
1. Envie o link para você mesmo no WhatsApp
2. O preview aparecerá automaticamente

#### Opção C: Instagram Stories
1. Cole o link em uma Story
2. O preview aparecerá como um sticker/card

### 3. Validar as Meta Tags

Você pode verificar se as meta tags foram inseridas corretamente:
```bash
# Inspecione o HTML gerado
curl https://seusite.com/vehicle/123 | grep "og:"
```

Ou use ferramentas online:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **LinkedIn**: https://www.linkedin.com/post-inspector/
- **Twitter**: https://cards-dev.twitter.com/validator
- **Open Graph Check**: https://www.opengraph.xyz/

## 📁 Arquivos modificados

1. **`src/components/SEO.tsx`** (NOVO)
   - Componente reutilizável para meta tags
   - Suporta Open Graph, Twitter Cards e WhatsApp

2. **`src/App.tsx`**
   - Adicionado `HelmetProvider` para gerenciar meta tags

3. **`src/pages/VehicleDetail.tsx`**
   - Adicionado componente `<SEO>` com dados do veículo
   - Botão de compartilhamento com menu dropdown
   - Funções de compartilhamento para WhatsApp, Facebook e copiar link

4. **`package.json`**
   - Adicionada dependência `react-helmet-async`

## 🎨 Exemplo de Preview

Quando alguém compartilhar o link de um veículo, aparecerá:

```
┌─────────────────────────────────┐
│  [Foto do Veículo]              │
├─────────────────────────────────┤
│  Fiat Uno 2020                  │
│  Acessorauto Veículos           │
├─────────────────────────────────┤
│  Fiat Uno 2020 - Flex -         │
│  50.000 km - R$ 45.000,00       │
└─────────────────────────────────┘
       [VER DETALHES]
```

## 🔧 Personalização

Para alterar a imagem padrão quando não houver foto do veículo, edite:
```typescript
// src/components/SEO.tsx
image = '/og-default.jpg'  // Altere para sua imagem padrão
```

## 📱 Compatibilidade

- ✅ Facebook
- ✅ Instagram
- ✅ WhatsApp
- ✅ LinkedIn
- ✅ Twitter/X
- ✅ Telegram
- ✅ iMessage

## 🐛 Troubleshooting

### Preview não aparece
1. Verifique se a URL é pública (não localhost)
2. Certifique-se que as imagens são acessíveis publicamente
3. Use o Facebook Debugger para limpar cache
4. Imagens devem ter pelo menos 200x200px (recomendado: 1200x630px)

### Imagem não carrega
1. Verifique se a URL da imagem é absoluta (não relativa)
2. Certifique-se que a imagem não requer autenticação
3. Formato recomendado: JPG ou PNG
4. Tamanho máximo: 8MB

### Cache antigo
- Use "Scrape Again" no Facebook Debugger
- WhatsApp: delete a conversa e envie novamente
- Pode levar alguns minutos para atualizar

## 📚 Referências

- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
