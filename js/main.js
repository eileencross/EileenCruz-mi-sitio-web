// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  const toggle = document.getElementById('menu-toggle');
  if (toggle && toggle.checked && !e.target.closest('.navbar') && !e.target.closest('.menu-icon')) {
    toggle.checked = false;
  }
});

// Validación del formulario de contacto
function initFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fields = {
    nombre: { mensaje: 'El nombre es obligatorio (mín. 3 caracteres)' },
    email: { mensaje: 'Ingresá un email válido' },
    mensaje: { mensaje: 'El mensaje debe tener al menos 10 caracteres' },
  };

  function mostrarError(input, texto) {
    const grupo = input.closest('.form-group');
    const existente = grupo.querySelector('.field-error');
    if (existente) existente.remove();
    const error = document.createElement('p');
    error.className = 'field-error';
    error.textContent = texto;
    grupo.appendChild(error);
    input.classList.add('input-error');
  }

  function limpiarError(input) {
    const grupo = input.closest('.form-group');
    const existente = grupo.querySelector('.field-error');
    if (existente) existente.remove();
    input.classList.remove('input-error');
  }

  function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valido = true;

    // Validar cada campo
    for (const [name, cfg] of Object.entries(fields)) {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input) continue;
      const valor = input.value.trim();
      limpiarError(input);

      if (!valor) {
        mostrarError(input, cfg.mensaje);
        valido = false;
      } else if (name === 'email' && !validarEmail(valor)) {
        mostrarError(input, 'Ingresá un email válido (ej: usuario@dominio.com)');
        valido = false;
      } else if (name === 'nombre' && valor.length < 3) {
        mostrarError(input, 'El nombre debe tener al menos 3 caracteres');
        valido = false;
      } else if (name === 'mensaje' && valor.length < 10) {
        mostrarError(input, 'El mensaje debe tener al menos 10 caracteres');
        valido = false;
      }
    }

    // Validar teléfono (opcional)
    const telInput = form.querySelector('[name="telefono"]');
    if (telInput && telInput.value.trim()) {
      limpiarError(telInput);
      if (!/^[0-9]{10}$/.test(telInput.value.trim())) {
        mostrarError(telInput, 'El teléfono debe tener 10 dígitos');
        valido = false;
      }
    }

    // Validar checkbox de aceptación
    const checkboxAcepto = form.querySelector('[name="acepto"]');
    if (checkboxAcepto && !checkboxAcepto.checked) {
      const grupo = checkboxAcepto.closest('.form-group');
      const existente = grupo.querySelector('.field-error');
      if (existente) existente.remove();
      const error = document.createElement('p');
      error.className = 'field-error';
      error.textContent = 'Debés aceptar el uso de tus datos para continuar';
      grupo.appendChild(error);
      valido = false;
    }

    if (!valido) return;

    // Enviar
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        form.innerHTML = `
          <div class="form-success">
            <span class="form-success-icon">✓</span>
            <p>¡Mensaje enviado con éxito! Te responderé a la brevedad.</p>
          </div>
        `;
      } else {
        alert('Error al enviar el mensaje. Intentá de nuevo.');
      }
    } catch {
      alert('Error de conexión. Asegurate de que el servidor esté corriendo.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    }
  });

  // Limpiar errores al escribir
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => limpiarError(input));
  });
}

// Esperar a que los componentes se inyecten
document.addEventListener('includes-loaded', () => {
  initFormValidation();
  initDarkMode();
});

// Modo oscuro
function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;

  const icon = toggle.querySelector('.dark-toggle-icon');
  const guardado = localStorage.getItem('dark-mode');

  if (guardado === 'true') {
    document.body.classList.add('dark-mode');
    icon.textContent = '☀️';
    toggle.setAttribute('aria-label', 'Cambiar a modo claro');
  }

  toggle.addEventListener('click', () => {
    const activo = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', activo);
    icon.textContent = activo ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', activo ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  });
}
