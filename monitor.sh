#!/bin/bash
# Script de monitoreo del contenedor Docker

echo "📊 Estado del Sistema de Pedidos"
echo "=================================="
echo ""

# Verificar si Docker está corriendo
if ! systemctl is-active --quiet docker; then
    echo "❌ Docker no está corriendo"
    exit 1
fi

echo "✅ Docker está activo"
echo ""

# Estado del contenedor
echo "🐳 Estado del Contenedor:"
docker-compose ps
echo ""

# Verificar si el contenedor está corriendo
CONTAINER_RUNNING=$(docker-compose ps | grep "Up" | wc -l)

if [ $CONTAINER_RUNNING -eq 0 ]; then
    echo "❌ El contenedor no está corriendo"
    echo ""
    echo "💡 Para iniciar: docker-compose up -d"
    exit 1
fi

echo "✅ Contenedor en ejecución"
echo ""

# Uso de recursos
echo "💻 Uso de Recursos:"
docker stats sistema-pedidos-restaurante --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo ""

# Verificar puerto
PORT=3001
echo "🌐 Verificando Puerto $PORT:"
if nc -z localhost $PORT 2>/dev/null; then
    echo "✅ Puerto $PORT respondiendo"
    
    # Hacer una petición HTTP
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
        echo "✅ Aplicación respondiendo correctamente (HTTP $HTTP_CODE)"
    else
        echo "⚠️  Aplicación responde con código: $HTTP_CODE"
    fi
else
    echo "❌ Puerto $PORT no responde"
fi
echo ""

# Últimas líneas de log
echo "📝 Últimos logs (últimas 10 líneas):"
echo "-----------------------------------"
docker-compose logs --tail=10
echo ""

# Información de datos
echo "📂 Archivos de Datos:"
ls -lh data/
echo ""

# Tamaño total
DATA_SIZE=$(du -sh data/ | cut -f1)
echo "💾 Tamaño total de datos: $DATA_SIZE"
echo ""

# Contar pedidos
if [ -f "data/pedidos.json" ]; then
    PEDIDOS_COUNT=$(grep -o '"id"' data/pedidos.json | wc -l)
    echo "📋 Total de pedidos registrados: $PEDIDOS_COUNT"
fi

echo ""
echo "=================================="
echo "📊 Monitoreo completado"
echo ""
echo "💡 Comandos útiles:"
echo "   Ver logs en vivo:  docker-compose logs -f"
echo "   Reiniciar:         docker-compose restart"
echo "   Detener:           docker-compose down"
