const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, requireRole } = require('../middleware/auth');

const pedidosPath = path.join(__dirname, '..', 'data', 'pedidos.json');
const productosPath = path.join(__dirname, '..', 'data', 'productos.json');

// Obtener todos los productos
router.get('/productos', requireAuth, (req, res) => {
  try {
    const productos = JSON.parse(fs.readFileSync(productosPath, 'utf8'));
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

// Crear nuevo pedido (solo mesero)
router.post('/', requireRole(['mesero']), (req, res) => {
  try {
    const { items, observaciones, mesa } = req.body;
    
    // Leer pedidos actuales
    let pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    
    // Crear nuevo pedido
    const nuevoPedido = {
      id: Date.now(),
      numero: pedidos.length + 1,
      items: items,
      observaciones: observaciones || '',
      mesa: mesa || 'Sin mesa',
      mesero: req.session.usuario.nombre,
      fecha: new Date().toISOString(),
      estado: 'pendiente', // pendiente, en_cocina, entregado, cobrado
      total: calcularTotal(items)
    };
    
    // Agregar pedido
    pedidos.push(nuevoPedido);
    
    // Guardar en archivo
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
    
    res.json({
      success: true,
      pedido: nuevoPedido
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pedido', detalle: error.message });
  }
});

// Obtener todos los pedidos
router.get('/', requireAuth, (req, res) => {
  try {
    const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer pedidos' });
  }
});

// Función auxiliar para calcular total
function calcularTotal(items) {
  const productos = JSON.parse(fs.readFileSync(productosPath, 'utf8'));
  let total = 0;
  
  items.forEach(item => {
    const producto = productos.find(p => p.id === item.productoId);
    if (producto) {
      total += producto.precio * item.cantidad;
    }
  });
  
  return parseFloat(total.toFixed(2));
}

module.exports = router;
