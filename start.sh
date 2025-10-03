#!/bin/bash

echo "🚀 Iniciando Acessorauto..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se PostgreSQL está rodando
echo "📊 Verificando PostgreSQL..."
if ! pg_isready > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  PostgreSQL não está rodando. Inicie o PostgreSQL primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL está rodando${NC}"
echo ""

# Verificar se o banco existe
echo "📦 Verificando banco de dados..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw acessorauto; then
    echo -e "${YELLOW}⚠️  Banco 'acessorauto' não encontrado. Criando...${NC}"
    createdb -U postgres acessorauto
    echo -e "${GREEN}✅ Banco criado${NC}"
fi
echo ""

# Executar migrações
echo "🔄 Executando migrações..."
psql -U postgres -d acessorauto -f supabase/migrations/20251002194425_create_garage_schema.sql > /dev/null 2>&1
echo -e "${GREEN}✅ Migrações executadas${NC}"
echo ""

# Instalar dependências do servidor se necessário
if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependências do servidor..."
    cd server && npm install && cd ..
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
    echo ""
fi

# Iniciar servidor backend em background
echo "🔧 Iniciando servidor backend..."
cd server && npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
cd ..
echo -e "${GREEN}✅ Servidor backend iniciado (PID: $SERVER_PID)${NC}"
echo ""

# Aguardar servidor iniciar
sleep 2

# Iniciar frontend
echo "🎨 Iniciando frontend..."
npm run dev

# Cleanup quando Ctrl+C
trap "kill $SERVER_PID 2>/dev/null" EXIT
