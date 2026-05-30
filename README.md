# 🍽️ Sistema de Gestión de Pedidos para Restaurante

Sistema web para gestionar pedidos de restaurante con tres roles: Mesero, Cocinero y Cajero.

## 📋 Características

- **Mesero**: Toma pedidos, selecciona productos del menú y agrega observaciones
- **Cocinero**: Visualiza pedidos pendientes y marca cuando son entregados a mesa
- **Cajero**: Gestiona facturación y marca pedidos como cobrados
- **Actualización en tiempo real**: Las interfaces se actualizan automáticamente cada 5 segundos
- **Autenticación básica**: Sistema de login por roles
- **Sin base de datos**: Usa archivos JSON para almacenamiento

## 🛠️ Tecnologías

- Node.js
- Express
- HTML/CSS/JavaScript vanilla
- Almacenamiento en archivos JSON

## 📦 Instalación y Ejecución

### 🐳 OPCIÓN 1: Con Docker (Recomendado para Servidor)

**Despliegue automático:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Despliegue manual:**
```bash
# Construir imagen
docker-compose build

# Iniciar aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Ver documentación completa: [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md)

### 💻 OPCIÓN 2: Instalación Tradicional (Node.js)

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar aplicación**:
```bash
npm start
```

El servidor se iniciará en: **http://localhost:3001**

## 👥 Usuarios de Prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Mesero | `mesero` | `mesero123` |
| Cocinero | `cocinero` | `cocinero123` |
| Cajero | `cajero` | `cajero123` |

## 📂 Estructura del Proyecto

```
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── data/                  # Archivos JSON
│   ├── usuarios.json      # Credenciales de usuarios
│   ├── productos.json     # Menú/productos
│   └── pedidos.json       # Registro de pedidos
├── middleware/
│   └── auth.js            # Middleware de autenticación
├── routes/                # Rutas de la API
│   ├── auth.js            # Login/logout
│   ├── pedidos.js         # Gestión de pedidos
│   ├── cocina.js          # Interface de cocina
│   └── caja.js            # Interface de caja
└── public/                # Frontend
    ├── index.html         # Página de login
    ├── pedidos.html       # Interface mesero
    ├── cocina.html        # Interface cocinero
    ├── caja.html          # Interface cajero
    ├── css/
    │   └── styles.css     # Estilos
    └── js/
        ├── login.js
        ├── pedidos.js
        ├── cocina.js
        └── caja.js
```

## 🔄 Flujo de Trabajo

1. **Mesero** ingresa al sistema → Toma pedido → Envía a cocina
2. **Cocinero** recibe alerta → Prepara pedido → Marca "Entregado a Mesa"
3. **Cajero** visualiza pedidos → Cliente paga → Marca "Cobrado/Facturado"

## 🌐 URLs del Sistema

- `/` - Login
- `/pedidos.html` - Interface del mesero
- `/cocina.html` - Interface del cocinero
- `/caja.html` - Interface del cajero

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/sesion` - Verificar sesión activa

### Pedidos
- `GET /api/pedidos/productos` - Obtener menú
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos` - Listar todos los pedidos

### Cocina
- `GET /api/cocina/pedidos` - Pedidos pendientes
- `PUT /api/cocina/pedido/:id` - Actualizar estado del pedido

### Caja
- `GET /api/caja/pedidos` - Todos los pedidos
- `PUT /api/caja/pedido/:id/cobrar` - Marcar como cobrado

## ⚙️ Configuración

- **Puerto**: 3001 (modificar en `server.js` si es necesario)
- **Sesiones**: Configuradas con `express-session`
- **Productos**: Editar `data/productos.json` para modificar el menú
- **Usuarios**: Editar `data/usuarios.json` para agregar/modificar usuarios

## 🔒 Seguridad

⚠️ **Nota**: Este es un sistema de simulación/demo. Para producción se recomienda:
- Encriptar contraseñas (bcrypt)
- Usar base de datos real
- Implementar HTTPS
- Agregar validación de datos más robusta
- Implementar tokens JWT o similar

## 📝 Notas

- Los pedidos se almacenan en `data/pedidos.json`
- Las actualizaciones se hacen mediante polling (cada 5 segundos)
- El sistema usa almacenamiento en archivos JSON (no requiere base de datos)

## 🐛 Troubleshooting

**Puerto 3001 ocupado**:
```bash
# Cambiar el puerto en server.js línea 8
const PORT = 3002; // o el puerto que prefieras
```

**Error al iniciar**:
```bash
# Asegurarse de tener Node.js instalado
node --version

# Reinstalar dependencias
rm -rf node_modules
npm install
```

---

Desarrollado como sistema de simulación para gestión de pedidos de restaurante 🚀
