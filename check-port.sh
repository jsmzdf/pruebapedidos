#!/bin/bash
# Script simple para verificar puerto y sugerir alternativo

PUERTO=3001

echo "Verificando puerto $PUERTO..."

if netstat -tuln | grep -q ":$PUERTO "; then
    echo "❌ Puerto $PUERTO OCUPADO"
    echo ""
    echo "Puertos disponibles sugeridos:"
    for p in 3002 3003 3004 3005 3010; do
        if ! netstat -tuln | grep -q ":$p "; then
            echo "  ✅ $p disponible"
        fi
    done
else
    echo "✅ Puerto $PUERTO DISPONIBLE"
fi
