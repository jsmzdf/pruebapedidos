const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar sesiones
app.use(session({
  secret: 'restaurante-secreto-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Sistema de Gestión de Pedidos para Restaurante`);
});
