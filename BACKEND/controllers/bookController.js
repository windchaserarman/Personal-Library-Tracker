const Book = require('../models/Book');
const { validationResult } = require('express-validator');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, genre, isRead, notes } = req.body;

    const book = new Book({
      title,
      author,
      genre,
      isRead: isRead || false,
      notes: notes || '',
      user: req.user._id
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, genre, isRead, notes } = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, author, genre, isRead, notes },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
