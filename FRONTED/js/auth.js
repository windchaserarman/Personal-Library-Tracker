const API_BASE_URL = 'https://library-backend-1-a1yi.onrender.com/api'; // ✅ Live Render URL


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');
const messageDiv = document.getElementById('message');

showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginFormContainer.classList.add('hidden');
  registerFormContainer.classList.remove('hidden');
  clearMessage();
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerFormContainer.classList.add('hidden');
  loginFormContainer.classList.remove('hidden');
  clearMessage();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      showMessage(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    showMessage('Network error. Please try again.', 'error');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage('Registration successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      showMessage(data.errors?.map(err => err.msg).join(', ') || data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    showMessage('Network error. Please try again.', 'error');
  }
});

function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');
  setTimeout(() => messageDiv.classList.add('hidden'), 5000);
}

function clearMessage() {
  messageDiv.classList.add('hidden');
}

function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) window.location.href = 'dashboard.html';
}

checkAuth();
