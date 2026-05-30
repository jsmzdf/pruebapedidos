#!/bin/bash
# Script para hacer backup de los datos de la aplicación

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE"

echo "🗂️  Creando backup de datos..."
echo ""

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Crear backup
cp -r data/ "$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: $BACKUP_DIR/$BACKUP_NAME"
    echo ""
    echo "📊 Contenido del backup:"
    ls -lh "$BACKUP_DIR/$BACKUP_NAME/"
    echo ""
    echo "📂 Todos los backups:"
    ls -lh $BACKUP_DIR/
else
    echo "❌ Error al crear backup"
    exit 1
fi

# Limpiar backups antiguos (mantener últimos 10)
BACKUP_COUNT=$(ls -1 $BACKUP_DIR | wc -l)
if [ $BACKUP_COUNT -gt 10 ]; then
    echo ""
    echo "🧹 Limpiando backups antiguos (manteniendo últimos 10)..."
    ls -t $BACKUP_DIR | tail -n +11 | xargs -I {} rm -rf "$BACKUP_DIR/{}"
    echo "✅ Backups antiguos eliminados"
fi

echo ""
echo "📝 Para restaurar este backup:"
echo "   cp -r $BACKUP_DIR/$BACKUP_NAME/* data/"
