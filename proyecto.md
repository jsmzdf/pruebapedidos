# Sistema de Gestión de Pedidos para Restaurante

## 📝 Descripción General
Aplicación web de simulación para gestionar pedidos de restaurante con tres roles diferenciados: Mesero, Cocinero y Cajero.

## 🎯 Funcionalidades por Rol

### 1. Mesero (Interfaz de Pedidos)
- **Tomar pedidos**: Seleccionar productos del menú disponible (basado en factura de pedidos.png)
- **Observaciones**: Campo de texto para agregar notas especiales del cliente
- **Envío**: Al confirmar el pedido, se genera automáticamente:
  - Una alerta para cocina
  - Un registro en caja para facturación

### 2. Cocinero (Interfaz de Cocina)
- **Ver pedidos pendientes**: Lista de pedidos recibidos con alertas
- **Actualizar estado**: Botón para marcar cuando el pedido fue "Entregado a Mesa"
- **Actualización en tiempo real**: Los nuevos pedidos aparecen automáticamente

### 3. Cajero (Interfaz de Caja)
- **Ver pedidos**: Lista de todos los pedidos para facturar
- **Cobrar/Facturar**: Botón para marcar cuando el pedido fue "Cobrado/Facturado"
- **Seguimiento**: Visualizar el estado de cada pedido

## 🛠️ Tecnologías

### Backend
- **Node.js con Express**
- **Puerto**: 3001 (evitar conflicto con aplicación existente en puerto 3000)
- **Almacenamiento**: Archivos JSON (sin base de datos)

### Frontend
- HTML, CSS, JavaScript
- Actualización dinámica mediante polling o WebSockets

## 🔐 Autenticación
- Login básico con tres roles: mesero, cocinero, cajero
- Credenciales almacenadas en archivo JSON
- Control de acceso según rol

## 📂 Estructura de URLs
- `/` - Página de login
- `/pedidos` - Interfaz del mesero
- `/cocina` - Interfaz del cocinero
- `/caja` - Interfaz del cajero

## 📊 Archivos JSON
- `usuarios.json` - Credenciales y roles
- `productos.json` - Menú disponible (datos de factura de pedidos.png)
- `pedidos.json` - Registro de pedidos con estados

## 🔄 Flujo de Trabajo
1. **Mesero** toma el pedido → envía al sistema
2. **Sistema** genera alerta → aparece en cocina y caja
3. **Cocinero** prepara → marca "Entregado a Mesa"
4. **Cajero** cobra → marca "Cobrado/Facturado"