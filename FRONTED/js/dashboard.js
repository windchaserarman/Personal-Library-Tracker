const API_BASE_URL = 'https://library-backend-1-a1yi.onrender.com/api'; // ✅ Live Render URL


const userWelcome = document.getElementById('userWelcome');
const logoutBtn = document.getElementById('logoutBtn');
const booksContainer = document.getElementById('booksContainer');
const emptyState = document.getElementById('emptyState');
const filterStatus = document.getElementById('filterStatus');
const searchBooks = document.getElementById('searchBooks');
const totalBooks = document.getElementById('totalBooks');
const readBooks = document.getElementById('readBooks');
const unreadBooks = document.getElementById('unreadBooks');
const messageDiv = document.getElementById('message');

let allBooks = [], filteredBooks = [];

function checkAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

async function init() {
  if (!checkAuth()) return;
  displayUserInfo();
  await loadBooks();
  setupEventListeners();
}

function displayUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) userWelcome.textContent = `Welcome, ${user.name}!`;
}

function setupEventListeners() {
  logoutBtn.addEventListener('click', logout);
  filterStatus.addEventListener('change', filterBooks);
  searchBooks.addEventListener('input', filterBooks);
}

async function loadBooks() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      allBooks = await response.json();
      filteredBooks = [...allBooks];
      displayBooks();
      updateStats();
    } else {
      showMessage('Failed to load books', 'error');
    }
  } catch {
    showMessage('Network error. Please try again.', 'error');
  }
}

function displayBooks() {
  booksContainer.innerHTML = '';
  if (filteredBooks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  booksContainer.innerHTML = filteredBooks.map(book => `
    <div class="book-card ${book.isRead ? 'read' : 'unread'}">
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">by ${escapeHtml(book.author)}</div>
      <div class="book-genre">${escapeHtml(book.genre)}</div>
      <div class="book-status ${book.isRead ? 'read' : 'unread'}">${book.isRead ? 'Read' : 'To Read'}</div>
      ${book.notes ? `<div class="book-notes">"${escapeHtml(book.notes)}"</div>` : ''}
      <div class="book-actions">
        <button class="btn btn-primary" onclick="editBook('${book._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
      </div>
    </div>`).join('');
}

function filterBooks() {
  const status = filterStatus.value;
  const search = searchBooks.value.toLowerCase();
  filteredBooks = allBooks.filter(book =>
    (status === 'all' || (status === 'read' && book.isRead) || (status === 'unread' && !book.isRead)) &&
    (book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search))
  );
  displayBooks();
}

function updateStats() {
  totalBooks.textContent = allBooks.length;
  readBooks.textContent = allBooks.filter(b => b.isRead).length;
  unreadBooks.textContent = allBooks.filter(b => !b.isRead).length;
}

function editBook(id) {
  window.location.href = `add-book.html?id=${id}`;
}

async function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      showMessage('Book deleted successfully', 'success');
      await loadBooks();
    } else {
      showMessage(data.message || 'Delete failed', 'error');
    }
  } catch {
    showMessage('Network error. Please try again.', 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');
  setTimeout(() => messageDiv.classList.add('hidden'), 5000);
}

document.addEventListener('DOMContentLoaded', init);
