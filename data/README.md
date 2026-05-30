# 📂 Carpeta de Datos (JSON)

Esta carpeta contiene los archivos JSON que sirven como base de datos para la aplicación.

## Archivos

### `usuarios.json`
Contiene las credenciales de los usuarios del sistema.

**Estructura:**
```json
[
  {
    "id": 1,
    "usuario": "mesero",
    "password": "mesero123",
    "rol": "mesero",
    "nombre": "Juan Pérez"
  }
]
```

**Roles disponibles:** `mesero`, `cocinero`, `cajero`

---

### `productos.json`
Contiene el menú de productos disponibles.

**Estructura:**
```json
[
  {
    "id": 1,
    "nombre": "Hamburguesa Clásica",
    "precio": 8.99,
    "categoria": "Hamburguesas"
  }
]
```

**Categorías:** Hamburguesas, Pizzas, Ensaladas, Acompañamientos, Bebidas, Pastas, Carnes

---

### `pedidos.json`
Almacena todos los pedidos realizados.

**Estructura:**
```json
[
  {
    "id": 1234567890,
    "numero": 1,
    "items": [
      {
        "productoId": 1,
        "cantidad": 2
      }
    ],
    "observaciones": "Sin cebolla",
    "mesa": "Mesa 5",
    "mesero": "Juan Pérez",
    "fecha": "2024-05-30T10:30:00.000Z",
    "estado": "pendiente",
    "total": 17.98
  }
]
```

**Estados posibles:**
- `pendiente` - Recién creado
- `en_cocina` - En preparación
- `entregado` - Entregado a la mesa
- `cobrado` - Facturado y cobrado

---

## ⚠️ Importante

- Estos archivos son **persistentes** incluso al reiniciar el contenedor Docker (gracias al volumen configurado)
- **NO eliminar** estos archivos mientras la aplicación está corriendo
- Para hacer backup: copiar toda la carpeta `data/`
- Para resetear datos: eliminar contenido de `pedidos.json` y dejar solo `[]`

---

## 🔧 Modificar Datos

### Agregar nuevo usuario:
Editar `usuarios.json` y agregar objeto con:
- `id` único
- `usuario`, `password`, `rol`, `nombre`

### Agregar nuevo producto:
Editar `productos.json` y agregar objeto con:
- `id` único
- `nombre`, `precio`, `categoria`

### Limpiar pedidos antiguos:
```bash
echo "[]" > data/pedidos.json
```

---

## 📊 Backup de Datos

```bash
# Crear backup
cp -r data/ data_backup_$(date +%Y%m%d)/

# Restaurar backup
cp -r data_backup_20240530/ data/
```

---

## 🐳 En Docker

Los datos están montados como volumen:
```yaml
volumes:
  - ./data:/app/data
```

Esto significa que los datos se mantienen incluso si:
- Detienes el contenedor
- Eliminas el contenedor
- Actualizas la aplicación
