const express = require('express');
const { body } = require('express-validator');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', bookValidation, createBook);
router.put('/:id', bookValidation, updateBook);
router.delete('/:id', deleteBook);

module.exports = router;