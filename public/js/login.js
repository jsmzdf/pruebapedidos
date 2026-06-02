document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirigir según el rol
      switch(data.usuario.rol) {
        case 'mesero':
          window.location.href = '/pedidos.html';
          break;
        case 'cocinero':
          window.location.href = '/cocina.html';
          break;
        case 'cajero':
          window.location.href = '/caja.html';
          break;
        default:
          window.location.href = '/';
      }
    } else {
      errorMessage.textContent = data.error;
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = 'Error al conectar con el servidor';
    errorMessage.style.display = 'block';
  }
});

// Función para mostrar/ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.textContent = '👁️‍🗨️';
  } else {
    passwordInput.type = 'password';
    eyeIcon.textContent = '👁️';
  }
}
