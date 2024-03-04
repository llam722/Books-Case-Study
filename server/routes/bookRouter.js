import express from 'express';
import bookController from '../controllers/bookController.js';

const router = express.Router();

router.get('/', bookController.getBooks, (req, res) => {
	res.status(200).json(res.locals.books);
});

router.get('/stats', bookController.getStats, (req, res) => {
	res.status(200).json(res.locals.stats);
});

router.get('/search', bookController.searchBooks, (req, res) => {
	res.status(200).json(res.locals.books);
});

router.get('/:id', bookController.getBookById, (req, res) => {
	res.status(200).json(res.locals.book);
});

router.post('/', bookController.addBook, (req, res) => {
	res.status(201).json(res.locals.newBook);
});

router.put('/:id', bookController.updateBook, (req, res) => {
	res.status(200).json(res.locals.updatedBook);
});

router.delete('/:id', bookController.deleteBook, (req, res) => {
	res.status(200).json(res.locals.deletedBook);
});

export default router;
