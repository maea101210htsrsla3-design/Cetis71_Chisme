async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  alert(await response.text());
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    window.location.href = 'chisme.html';
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

async function guardarNota() {
  const texto = document.getElementById('nota').value;
  await fetch('/nota', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto })
  });
  document.getElementById('nota').value = '';
  cargarNotas();
}

async function cargarNotas() {
  const res = await fetch('/notas');
  const notas = await res.json();
  const contenedor = document.getElementById('listaNotas');
  contenedor.innerHTML = '';
  notas.forEach(nota => {
    contenedor.innerHTML += `
      <div class="nota">
        <p>${nota.texto}</p>
        <button onclick="likeNota(${nota.id})">❤️ ${nota.likes}</button>
      </div>`;
  });
}

async function likeNota(id) {
  await fetch(`/nota/${id}/like`, { method: 'POST' });
  cargarNotas();
}
