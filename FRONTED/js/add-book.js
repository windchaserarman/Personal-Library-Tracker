
const API_BASE_URL = 'https://library-backend-1-a1yi.onrender.com/api'; // ✅ Live Render URL

const pageTitle = document.getElementById('pageTitle');
const bookForm = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');
const bookGenre = document.getElementById('bookGenre');
const bookIsRead = document.getElementById('bookIsRead');
const bookNotes = document.getElementById('bookNotes');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

let isEditMode = false;
let currentBookId = null;

function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

async function init() {
  if (!checkAuth()) return;

  setupEventListeners();

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (bookId) {
    isEditMode = true;
    currentBookId = bookId;
    pageTitle.textContent = 'Edit Book';
    submitBtn.textContent = 'Update Book';
    await loadBook(bookId);
  }
}

function setupEventListeners() {
  bookForm.addEventListener('submit', handleSubmit);
  bookNotes.addEventListener('input', updateCharCounter);
}

async function loadBook(bookId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const book = await response.json();
      populateForm(book);
    } else {
      showMessage('Failed to load book', 'error');
      setTimeout(() => window.location.href = 'dashboard.html', 2000);
    }
  } catch {
    showMessage('Network error. Please try again.', 'error');
  }
}

function populateForm(book) {
  bookTitle.value = book.title;
  bookAuthor.value = book.author;
  bookGenre.value = book.genre;
  bookIsRead.checked = book.isRead;
  bookNotes.value = book.notes || '';
  updateCharCounter();
}

async function handleSubmit(e) {
  e.preventDefault();

  const bookData = {
    title: bookTitle.value.trim(),
    author: bookAuthor.value.trim(),
    genre: bookGenre.value.trim(),
    isRead: bookIsRead.checked,
    notes: bookNotes.value.trim()
  };

  try {
    const token = localStorage.getItem('token');
    const url = isEditMode
      ? `${API_BASE_URL}/books/${currentBookId}`
      : `${API_BASE_URL}/books`;

    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    const data = await response.json();

    if (response.ok) {
      const message = isEditMode ? 'Book updated successfully!' : 'Book added successfully!';
      showMessage(message, 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      showMessage(data.errors?.map(err => err.msg).join(', ') || data.message || 'Operation failed', 'error');
    }
  } catch {
    showMessage('Network error. Please try again.', 'error');
  }
}

function updateCharCounter() {
  const charCount = bookNotes.value.length;
  const counter = document.querySelector('.char-counter');
  counter.textContent = `${charCount}/500 characters`;
  counter.style.color = charCount > 450 ? '#dc3545' : charCount > 400 ? '#ffc107' : '#666';
}

function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');
  setTimeout(() => messageDiv.classList.add('hidden'), 5000);
}

document.addEventListener('DOMContentLoaded', init);