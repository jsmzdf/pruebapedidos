let pedidos = [];
let intervalId = null;

// Verificar sesión al cargar
window.addEventListener('load', async () => {
  const sesion = await verificarSesion();
  if (!sesion || sesion.usuario.rol !== 'cocinero') {
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
    const response = await fetch('/api/cocina/pedidos');
    pedidos = await response.json();
    mostrarPedidos();
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

function mostrarPedidos() {
  const container = document.getElementById('pedidosContainer');
  const countElement = document.getElementById('pedidosPendientes');
  
  countElement.textContent = pedidos.length;
  
  if (pedidos.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay pedidos pendientes</p>';
    return;
  }
  
  let html = '';
  
  pedidos.forEach(pedido => {
    const esNuevo = pedido.estado === 'pendiente';
    const fecha = new Date(pedido.fecha);
    
    html += `
      <div class="pedido-card ${esNuevo ? 'nuevo' : ''}">
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
            ${pedido.items.map(item => `
              <li>
                <span>${obtenerNombreProducto(item.productoId)} x ${item.cantidad}</span>
              </li>
            `).join('')}
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
          </div>
          <div>
            ${pedido.estado === 'pendiente' ? `
              <button onclick="marcarEnCocina(${pedido.id})" class="btn btn-secondary">
                En Preparación
              </button>
            ` : ''}
            <button onclick="marcarEntregado(${pedido.id})" class="btn btn-success">
              ✓ Entregado a Mesa
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

async function marcarEnCocina(pedidoId) {
  await actualizarEstadoPedido(pedidoId, 'en_cocina');
}

async function marcarEntregado(pedidoId) {
  if (confirm('¿Confirmar que el pedido fue entregado a la mesa?')) {
    await actualizarEstadoPedido(pedidoId, 'entregado');
  }
}

async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  try {
    const response = await fetch(`/api/cocina/pedido/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    
    const data = await response.json();
    
    if (data.success) {
      cargarPedidos();
    } else {
      alert('Error al actualizar pedido');
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
  }
}

function obtenerNombreProducto(productoId) {
  // Productos hardcodeados (en producción se cargarían del servidor)
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

function obtenerTextoEstado(estado) {
  const estados = {
    'pendiente': '⏱️ Pendiente',
    'en_cocina': '👨‍🍳 En Preparación',
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
