const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta de login
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  
  // Leer usuarios del archivo JSON
  const usuariosPath = path.join(__dirname, '..', 'data', 'usuarios.json');
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
  
  // Buscar usuario
  const usuarioEncontrado = usuarios.find(u => 
    u.usuario === usuario && u.password === password
  );
  
  if (usuarioEncontrado) {
    // Guardar en sesión (sin password)
    req.session.usuario = {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
      nombre: usuarioEncontrado.nombre
    };
    
    res.json({
      success: true,
      usuario: req.session.usuario
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Usuario o contraseña incorrectos'
    });
  }
});

// Ruta de logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Verificar sesión
router.get('/sesion', (req, res) => {
  if (req.session && req.session.usuario) {
    res.json({
      autenticado: true,
      usuario: req.session.usuario
    });
  } else {
    res.json({ autenticado: false });
  }
});

module.exports = router;
