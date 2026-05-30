const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireRole } = require('../middleware/auth');

const pedidosPath = path.join(__dirname, '..', 'data', 'pedidos.json');

// Obtener todos los pedidos para caja
router.get('/pedidos', requireRole(['cajero']), (req, res) => {
  try {
    const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    
    // Ordenar por fecha descendente
    const pedidosOrdenados = pedidos.sort((a, b) => 
      new Date(b.fecha) - new Date(a.fecha)
    );
    
    res.json(pedidosOrdenados);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer pedidos de caja' });
  }
});

// Marcar pedido como cobrado
router.put('/pedido/:id/cobrar', requireRole(['cajero']), (req, res) => {
  try {
    const pedidoId = parseInt(req.params.id);
    
    // Leer pedidos
    let pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    
    // Buscar y actualizar pedido
    const index = pedidos.findIndex(p => p.id === pedidoId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Actualizar estado a cobrado
    pedidos[index].estado = 'cobrado';
    pedidos[index].horaCobro = new Date().toISOString();
    pedidos[index].cajero = req.session.usuario.nombre;
    
    // Guardar
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
    
    res.json({
      success: true,
      pedido: pedidos[index]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cobrar pedido' });
  }
});

module.exports = router;
