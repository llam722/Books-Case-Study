import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import bookController from '../controllers/bookController.js';
import {
	validateBookId,
	validateBookInputs,
	validateOptionalBookInputs,
	validateQuery,
	validateCheck,
} from '../middleware/bookValidation.js';

const router = express.Router();

//get request to retrieve all books
router.get('/', bookController.getBooks, (req, res) => {
	res.status(200).json(res.locals.books);
});

//get request to retrieve book collection stats
router.get('/stats', bookController.getStats, (req, res) => {
	res.status(200).json(res.locals.stats);
});

//get request to search for books by title or author
router.get('/search', validateQuery(), validateCheck, bookController.searchBooks, (req, res) => {
	res.status(200).json(res.locals.books);
});

//get request to retrieve a specific book by ID
router.get('/:id', validateBookId(), validateCheck, bookController.getBookById, (req, res) => {
	res.status(200).json(res.locals.book);
});

//post request to add a new book to the collection
router.post('/', validateBookInputs(), validateCheck, bookController.addBook, (req, res) => {
	res.status(201).json(res.locals.newBook);
});

//put request to update a specific book by ID
router.put(
	'/:id',
	validateBookId(),
	validateOptionalBookInputs(),
	validateCheck,
	bookController.updateBook,
	(req, res) => {
		res.status(200).json(res.locals.updatedBook);
	}
);

//delete request to delete a specific book by ID
router.delete('/:id', validateBookId(), validateCheck, bookController.deleteBook, (req, res) => {
	res.status(200).json(res.locals.deletedBook);
});

export default router;
