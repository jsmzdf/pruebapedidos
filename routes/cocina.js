const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireRole } = require('../middleware/auth');

const pedidosPath = path.join(__dirname, '..', 'data', 'pedidos.json');

// Obtener pedidos para cocina (pendientes y en cocina)
router.get('/pedidos', requireRole(['cocinero']), (req, res) => {
  try {
    const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    
    // Filtrar pedidos pendientes y en cocina
    const pedidosCocina = pedidos.filter(p => 
      p.estado === 'pendiente' || p.estado === 'en_cocina'
    );
    
    res.json(pedidosCocina);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer pedidos de cocina' });
  }
});

// Actualizar estado del pedido
router.put('/pedido/:id', requireRole(['cocinero']), (req, res) => {
  try {
    const pedidoId = parseInt(req.params.id);
    const { estado } = req.body;
    
    // Leer pedidos
    let pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    
    // Buscar y actualizar pedido
    const index = pedidos.findIndex(p => p.id === pedidoId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Actualizar estado
    pedidos[index].estado = estado;
    pedidos[index].horaEntrega = new Date().toISOString();
    
    // Guardar
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
    
    res.json({
      success: true,
      pedido: pedidos[index]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

module.exports = router;
