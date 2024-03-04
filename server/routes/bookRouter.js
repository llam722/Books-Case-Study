import express from 'express';
import { body, validationResult } from 'express-validator';
import bookController from '../controllers/bookController.js';

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
router.get('/search', bookController.searchBooks, (req, res) => {
	res.status(200).json(res.locals.books);
});

//get request to retrieve a specific book by ID
router.get('/:id', bookController.getBookById, (req, res) => {
	res.status(200).json(res.locals.book);
});

//post request to add a new book to the collection
router.post(
	'/',
	//validate the request body
	[
		//trims white space, ensures field is populated and escapes special characters
		body('title').trim().notEmpty().withMessage('Title is required').escape(),
		body('author').trim().notEmpty().withMessage('Author is required').escape(),
		body('publicationYear')
			.isInt({ min: 1, max: new Date().getFullYear() }) //validates publication year
			.withMessage('Publication year is required and must be a valid year') //error message if invalid
			.toInt(), //converts the value to an integer
	],
	(req, res, next) => {
		//check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		return next();
	},

	bookController.addBook,
	(req, res) => {
		res.status(201).json(res.locals.newBook);
	}
);

//put request to update a specific book by ID
router.put('/:id', bookController.updateBook, (req, res) => {
	res.status(200).json(res.locals.updatedBook);
});

//delete request to delete a specific book by ID
router.delete('/:id', bookController.deleteBook, (req, res) => {
	res.status(200).json(res.locals.deletedBook);
});

export default router;
