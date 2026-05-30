#!/bin/bash
# Script para verificar disponibilidad de puerto en Ubuntu/Linux
# Uso: ./verificar-puerto.sh [puerto]

PUERTO=${1:-3001}
RANGO=10

echo ""
echo "🔍 Verificando disponibilidad del puerto $PUERTO..."
echo ""

# Verificar si el puerto está en uso
if lsof -Pi :$PUERTO -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "❌ Puerto $PUERTO está OCUPADO"
    echo ""
    echo "📋 Proceso usando el puerto:"
    lsof -i :$PUERTO | grep LISTEN
    
    PID=$(lsof -ti :$PUERTO)
    if [ ! -z "$PID" ]; then
        echo ""
        echo "   PID: $PID"
        echo "   Proceso: $(ps -p $PID -o comm=)"
        echo ""
        echo "💡 Para liberar el puerto:"
        echo "   sudo kill $PID"
        echo "   o"
        echo "   sudo kill -9 $PID  (forzar)"
    fi
    
    echo ""
    echo "🔎 Buscando puertos alternativos..."
    for ((i=1; i<=$RANGO; i++)); do
        ALT_PUERTO=$((PUERTO + i))
        if ! lsof -Pi :$ALT_PUERTO -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "✅ Puerto alternativo disponible: $ALT_PUERTO"
            echo "   Usar: http://localhost:$ALT_PUERTO"
            break
        fi
    done
    
elif nc -z localhost $PUERTO 2>/dev/null; then
    echo "❌ Puerto $PUERTO está OCUPADO (detectado con nc)"
    echo ""
    echo "🔎 Buscando puertos alternativos..."
    for ((i=1; i<=$RANGO; i++)); do
        ALT_PUERTO=$((PUERTO + i))
        if ! nc -z localhost $ALT_PUERTO 2>/dev/null; then
            echo "✅ Puerto alternativo disponible: $ALT_PUERTO"
            echo "   Usar: http://localhost:$ALT_PUERTO"
            break
        fi
    done
else
    echo "✅ Puerto $PUERTO está DISPONIBLE"
    echo "   Puedes usar: http://localhost:$PUERTO"
fi

echo ""
echo "📋 Puertos Node.js en uso:"
if command -v lsof >/dev/null 2>&1; then
    lsof -i -P -n | grep LISTEN | grep node || echo "   No hay procesos Node.js ejecutándose"
else
    netstat -tulpn 2>/dev/null | grep LISTEN | grep node || echo "   No hay procesos Node.js ejecutándose"
fi

echo ""
echo "💡 Para cambiar el puerto en tu aplicación:"
echo "   Edita server.js y cambia: const PORT = 3001;"
echo "   Por ejemplo: const PORT = 3002;"
echo ""
