let productos = [];
let pedidoActual = [];

// Verificar sesión al cargar
window.addEventListener('load', async () => {
  const sesion = await verificarSesion();
  if (!sesion || sesion.usuario.rol !== 'mesero') {
    window.location.href = '/';
    return;
  }
  
  document.getElementById('userName').textContent = sesion.usuario.nombre;
  cargarProductos();
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

async function cargarProductos() {
  try {
    const response = await fetch('/api/pedidos/productos');
    productos = await response.json();
    mostrarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarProductos() {
  const container = document.getElementById('productosLista');
  container.innerHTML = '';
  
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
      <h4>${producto.nombre}</h4>
      <p class="categoria">${producto.categoria}</p>
      <p class="precio">$${producto.precio.toFixed(2)}</p>
      <div class="cantidad-control">
        <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
        <input type="number" id="cant-${producto.id}" value="0" min="0" readonly>
        <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function cambiarCantidad(productoId, cambio) {
  const input = document.getElementById(`cant-${productoId}`);
  let cantidad = parseInt(input.value) + cambio;
  
  if (cantidad < 0) cantidad = 0;
  
  input.value = cantidad;
  
  // Actualizar pedido actual
  actualizarPedidoActual(productoId, cantidad);
  actualizarResumen();
}

function actualizarPedidoActual(productoId, cantidad) {
  const index = pedidoActual.findIndex(item => item.productoId === productoId);
  
  if (cantidad === 0) {
    if (index !== -1) {
      pedidoActual.splice(index, 1);
    }
  } else {
    if (index !== -1) {
      pedidoActual[index].cantidad = cantidad;
    } else {
      pedidoActual.push({ productoId, cantidad });
    }
  }
}

function actualizarResumen() {
  const container = document.getElementById('resumenPedido');
  const totalElement = document.getElementById('totalPedido');
  
  if (pedidoActual.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay productos seleccionados</p>';
    totalElement.textContent = '0.00';
    return;
  }
  
  let total = 0;
  let html = '';
  
  pedidoActual.forEach(item => {
    const producto = productos.find(p => p.id === item.productoId);
    if (producto) {
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      
      html += `
        <div class="resumen-item">
          <div>
            <strong>${producto.nombre}</strong> x ${item.cantidad}
          </div>
          <div>$${subtotal.toFixed(2)}</div>
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
  totalElement.textContent = total.toFixed(2);
}

async function enviarPedido() {
  const mesa = document.getElementById('mesa').value.trim();
  const observaciones = document.getElementById('observaciones').value.trim();
  const mensaje = document.getElementById('mensaje');
  
  if (!mesa) {
    mostrarMensaje('Por favor ingrese el número de mesa', 'error');
    return;
  }
  
  if (pedidoActual.length === 0) {
    mostrarMensaje('Por favor seleccione al menos un producto', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mesa,
        observaciones,
        items: pedidoActual
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarMensaje('¡Pedido enviado a cocina exitosamente!', 'success');
      limpiarFormulario();
    } else {
      mostrarMensaje('Error al enviar pedido: ' + data.error, 'error');
    }
  } catch (error) {
    mostrarMensaje('Error al conectar con el servidor', 'error');
  }
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.style.display = 'block';
  
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 5000);
}

function limpiarFormulario() {
  document.getElementById('mesa').value = '';
  document.getElementById('observaciones').value = '';
  pedidoActual = [];
  
  // Resetear cantidades
  productos.forEach(producto => {
    document.getElementById(`cant-${producto.id}`).value = 0;
  });
  
  actualizarResumen();
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}
