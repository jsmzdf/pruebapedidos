// Middleware para verificar autenticación
function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
  }
  next();
}

// Middleware para verificar rol específico
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }
    
    if (!roles.includes(req.session.usuario.rol)) {
      return res.status(403).json({ error: 'No tiene permisos para acceder a este recurso.' });
    }
    
    next();
  };
}

module.exports = { requireAuth, requireRole };
