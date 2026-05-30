#!/bin/bash
# Script de despliegue automático con Docker

echo "🐳 Desplegando Sistema de Pedidos con Docker"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo ""
    echo "Instalar Docker en Ubuntu:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install docker.io docker-compose"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo ""
    echo "Instalar Docker Compose:"
    echo "  sudo apt-get install docker-compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker está instalado${NC}"
echo ""

# Verificar puerto disponible
PORT=3001
echo "🔍 Verificando puerto $PORT..."

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Puerto $PORT está ocupado${NC}"
    echo ""
    read -p "¿Quieres usar un puerto alternativo? (Ejemplo: 3002): " NEW_PORT
    if [ ! -z "$NEW_PORT" ]; then
        PORT=$NEW_PORT
        export PORT=$NEW_PORT
        echo -e "${GREEN}✅ Usando puerto: $PORT${NC}"
    else
        echo -e "${RED}Cancelado${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Puerto $PORT disponible${NC}"
fi

echo ""
echo "🏗️  Construyendo imagen Docker..."
docker-compose build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir la imagen${NC}"
    exit 1
fi

echo ""
echo "🚀 Iniciando contenedor..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar el contenedor${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ ¡Aplicación desplegada exitosamente!${NC}"
echo ""
echo "📋 Información del despliegue:"
echo "  🌐 URL: http://localhost:$PORT"
echo "  🐳 Contenedor: sistema-pedidos-restaurante"
echo ""
echo "📝 Comandos útiles:"
echo "  Ver logs:        docker-compose logs -f"
echo "  Detener:         docker-compose down"
echo "  Reiniciar:       docker-compose restart"
echo "  Ver estado:      docker-compose ps"
echo ""
