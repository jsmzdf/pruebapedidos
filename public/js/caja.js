let pedidos = [];
let intervalId = null;

// Verificar sesión al cargar
window.addEventListener('load', async () => {
  const sesion = await verificarSesion();
  if (!sesion || sesion.usuario.rol !== 'cajero') {
    window.location.href = '/';
    return;
  }
  
  document.getElementById('userName').textContent = sesion.usuario.nombre;
  cargarPedidos();
  
  // Actualizar cada 5 segundos
  intervalId = setInterval(cargarPedidos, 5000);
});

async function verificarSesion() {
  try {
    const response = await fetch('/api/auth/sesion');
    const data = await response.json();
    return data.autenticado ? data : null;
  } catch (error) {
    return null;
  }
}

async function cargarPedidos() {
  try {
    const response = await fetch('/api/caja/pedidos');
    pedidos = await response.json();
    mostrarPedidos();
    actualizarEstadisticas();
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

function mostrarPedidos() {
  const container = document.getElementById('pedidosContainer');
  
  if (pedidos.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay pedidos</p>';
    return;
  }
  
  let html = '';
  
  pedidos.forEach(pedido => {
    const fecha = new Date(pedido.fecha);
    const puedeCobrarse = pedido.estado === 'entregado';
    const yaCobrado = pedido.estado === 'cobrado';
    
    html += `
      <div class="pedido-card">
        <div class="pedido-header">
          <div>
            <span class="pedido-numero">Pedido #${pedido.numero}</span>
            <span class="pedido-mesa">${pedido.mesa}</span>
          </div>
          <span class="estado-badge estado-${pedido.estado}">
            ${obtenerTextoEstado(pedido.estado)}
          </span>
        </div>
        
        <div class="pedido-items">
          <strong>Items:</strong>
          <ul>
            ${pedido.items.map(item => {
              const subtotal = obtenerPrecioProducto(item.productoId) * item.cantidad;
              return `
                <li>
                  <span>${obtenerNombreProducto(item.productoId)} x ${item.cantidad}</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
        
        ${pedido.observaciones ? `
          <div class="pedido-observaciones">
            <strong>📝 Observaciones:</strong> ${pedido.observaciones}
          </div>
        ` : ''}
        
        <div class="pedido-footer">
          <div>
            <small>Mesero: ${pedido.mesero}</small><br>
            <small>Hora: ${fecha.toLocaleTimeString()}</small>
            ${pedido.cajero ? `<br><small>Cajero: ${pedido.cajero}</small>` : ''}
          </div>
          <div>
            <span class="pedido-total">Total: $${pedido.total.toFixed(2)}</span>
          </div>
        </div>
        
        ${puedeCobrarse ? `
          <button onclick="cobrarPedido(${pedido.id})" class="btn btn-success btn-large" style="margin-top: 15px;">
            💰 Cobrar / Facturar
          </button>
        ` : ''}
        
        ${yaCobrado && pedido.horaCobro ? `
          <div style="margin-top: 10px; text-align: center; color: #28a745;">
            <small>✓ Cobrado: ${new Date(pedido.horaCobro).toLocaleString()}</small>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function actualizarEstadisticas() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const pedidosHoy = pedidos.filter(p => {
    const fechaPedido = new Date(p.fecha);
    fechaPedido.setHours(0, 0, 0, 0);
    return fechaPedido.getTime() === hoy.getTime();
  });
  
  const pedidosPendientes = pedidos.filter(p => p.estado !== 'cobrado').length;
  const pedidosCobrados = pedidosHoy.filter(p => p.estado === 'cobrado').length;
  const totalDia = pedidosHoy
    .filter(p => p.estado === 'cobrado')
    .reduce((sum, p) => sum + p.total, 0);
  
  document.getElementById('pedidosPendientes').textContent = pedidosPendientes;
  document.getElementById('pedidosCobrados').textContent = pedidosCobrados;
  document.getElementById('totalDia').textContent = totalDia.toFixed(2);
}

async function cobrarPedido(pedidoId) {
  if (!confirm('¿Confirmar cobro/facturación de este pedido?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/caja/pedido/${pedidoId}/cobrar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('¡Pedido cobrado exitosamente!');
      cargarPedidos();
    } else {
      alert('Error al cobrar pedido: ' + data.error);
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
  }
}

function obtenerNombreProducto(productoId) {
  const productos = {
    1: 'Hamburguesa Clásica',
    2: 'Hamburguesa con Queso',
    3: 'Pizza Margherita',
    4: 'Pizza Pepperoni',
    5: 'Ensalada César',
    6: 'Papas Fritas',
    7: 'Refresco',
    8: 'Jugo Natural',
    9: 'Pasta Carbonara',
    10: 'Pollo a la Parrilla'
  };
  return productos[productoId] || `Producto ${productoId}`;
}

function obtenerPrecioProducto(productoId) {
  const precios = {
    1: 8.99, 2: 9.99, 3: 12.99, 4: 14.99, 5: 7.99,
    6: 3.99, 7: 2.50, 8: 3.50, 9: 11.99, 10: 13.99
  };
  return precios[productoId] || 0;
}

function obtenerTextoEstado(estado) {
  const estados = {
    'pendiente': '⏱️ Pendiente',
    'en_cocina': '👨‍🍳 En Cocina',
    'entregado': '✓ Entregado',
    'cobrado': '💰 Cobrado'
  };
  return estados[estado] || estado;
}

async function logout() {
  if (intervalId) clearInterval(intervalId);
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}
