const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3021;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar sesiones con FileStore para soportar múltiples usuarios simultáneos
app.use(session({
  store: new FileStore({
    path: './sessions',
    ttl: 86400, // 24 horas en segundos
    reapInterval: 3600 // Limpiar sesiones expiradas cada hora
  }),
  secret: 'restaurante-secreto-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  name: 'restaurante.sid', // Nombre único para la cookie de sesión
  rolling: true // Renovar la cookie en cada petición
}));

// Importar rutas
const authRoutes = require('./routes/auth');
const pedidosRoutes = require('./routes/pedidos');
const cocinaRoutes = require('./routes/cocina');
const cajaRoutes = require('./routes/caja');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/cocina', cocinaRoutes);
app.use('/api/caja', cajaRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Sistema de Gestión de Pedidos para Restaurante`);
});
