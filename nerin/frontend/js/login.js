import { login } from './api.js';

const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  errorDiv.style.display = 'none';
  try {
    const data = await login(email, password);
    // Según el rol, redirigir al panel o a la tienda
    const role = data.role;
    if (role === 'admin' || role === 'vendedor') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/shop.html';
    }
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  }
});

// Manejar envío del formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obtener valores de registro
    const newClient = {
      name: document.getElementById('company').value.trim(),
      cuit: document.getElementById('cuit').value.trim(),
      condicion_iva: document.getElementById('iva').value,
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('emailRegister').value.trim(),
      password: document.getElementById('passwordRegister').value
    };
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert('Tu solicitud de registro ha sido enviada. Nos pondremos en contacto pronto.');
        registerForm.reset();
      } else {
        alert(data.error || 'Error al registrar. Intenta nuevamente.');
      }
    } catch (err) {
      alert('Error de red al enviar la solicitud.');
    }
  });
}