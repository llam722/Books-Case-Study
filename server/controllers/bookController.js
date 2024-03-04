import { Book } from '../models/bookModel.js';

const bookController = {};

//Retrieve a list of all books. Implement pagination to limit the number of books returned per request.
bookController.getBooks = async (req, res, next) => {
	//if a page query parameter is provided, use it to determine which page of books to return, if not, default to the first page
	const page = parseInt(req.query.page) || 1;
	//the number of books to return per page, defaulted to 5
	const limit = parseInt(req.query.limit) || 5;
	//calculates the amount of pages to skip
	const skipPage = (page - 1) * limit;

	try {
		//find all books, limit the number of books returned to the limit, and skip the amount of books based on the page number
		const books = await Book.find().limit(limit).skip(skipPage);
		//if no books are found, return a 204 status code meaning no content
		if (books.length === 0) return res.status(204).json({ message: 'No books found...' });
		res.locals.books = books;
		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving books...' });
	}
};

//Retrieve details of a specific book by ID.
bookController.getBookById = async (req, res, next) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: 'No book ID provided...' });

	try {
		//find the book by the provided ID
		const book = await Book.findById(id);
		//if the book does not exist, return a 404 status code meaning not found
		if (!book) return res.status(404).json({ message: 'Book does not exist, check the ID and try again...' });
		res.locals.book = book;
		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving book, check the ID and try again...' });
	}
};

//Add a new book to the collection. Implement input validation to ensure all required fields are provided (`title`, `author`, `publicationYear`), and `publicationYear` should be a valid year in the past.
bookController.addBook = async (req, res, next) => {
	const { title, author, publicationYear } = req.body;

	//created error array to in case multiple fields are missing
	const errors = [];

	//if any of the fields are missing or not of the correct type, add an error to the errors array
	if (!title || typeof title !== 'string') errors.push('Title is required or must be a string...');
	if (!author || typeof author !== 'string') errors.push('Author is missing or must be a string...');
	if (!publicationYear || typeof publicationYear !== 'number')
		errors.push('Publication year is missing or must be a number...');

	//if there are any errors, return a 400 status code meaning bad request
	if (errors.length > 0) return res.status(400).json({ errors });

	//ensure the publication year is not in the future or negative
	const currentYear = new Date().getFullYear();
	if (publicationYear > currentYear || publicationYear < 0) {
		errors.push('Publication year cannot be in the future or negative...');
		return res.status(400).json({ errors });
	}

	try {
		//create a new book with the provided fields
		const newBook = await Book.create({
			title,
			author,
			publicationYear,
		});

		res.locals.newBook = newBook;
		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error adding book to database' });
	}
};

//Update details of a specific book by ID. Allow partial updates, and ensure validation is applied to the input data.
bookController.updateBook = async (req, res, next) => {
	const { id } = req.params;
	const { title, author, publicationYear } = req.body;
	const errors = [];

	//if no data or an empty object is provided, return an error
	if (!req.body || Object.keys(req.body).length === 0) {
		errors.push('No data provided to update book...');
		return res.status(400).json({ errors });
	}
	//implement same validation as addBook for publicationYear
	const currentYear = new Date().getFullYear();
	if (publicationYear > currentYear || publicationYear < 0) {
		errors.push('Publication year cannot be in the future or negative...');
		return res.status(400).json({ errors });
	}

	try {
		const book = await Book.findByIdAndUpdate(id);
		//if the book does not exist, return an error
		if (!book) {
			errors.push('Book does not exist...');
			return res.status(404).json({ errors });
		}
		//if the book exists, update the fields that are provided in the request body if they are not empty
		if (title) book.title = title;
		if (author) book.author = author;
		if (publicationYear) book.publicationYear = publicationYear;

		//save the updated book to the database
		const updatedBook = await book.save();
		res.locals.updatedBook = updatedBook;

		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error updating book, check the ID and try again...' });
	}
};

//Delete a specific book by ID.
bookController.deleteBook = async (req, res, next) => {
	const { id } = req.body;
	const errors = [];
	if (!id) {
		errors.push('No book ID provided...');
		return res.status(400).json({ errors });
	}

	try {
		const book = await Book.findById(id);
		//handles the case where the book does not exist
		if (!book) {
			errors.push('Book does not exist, check the ID and try again...');
			return res.status(404).json({ errors });
		}
		//if the book exists, delete it from the database and return the deleted book (in case the user wants to undo the delete operation)
		const deletedBook = await Book.findByIdAndDelete(id);
		res.locals.deletedBook = deletedBook;

		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error deleting book, check the ID and try again...' });
	}
};

//Implement search functionality to allow users to search for books by title or author
bookController.searchBooks = async (req, res, next) => {
	//to be defined depending on the search parameters provided
	const { q } = req.query;
	const errors = [];
	if (!q) {
		errors.push('No search parameters provided, please enter a query...');
		return res.status(400).json({ errors });
	}

	try {
		//use mongoDB's conditional $or operator and $regex operator to perform a case insensitive search
		const query = { $or: [{ title: { $regex: q, $options: 'i' } }, { author: { $regex: q, $options: 'i' } }] };
		//search by title, matches all books with case insensitive title
		const books = await Book.find(query);

		res.locals.books = books;
		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error searching for books...' });
	}
};

bookController.getStats = async (req, res, next) => {
	const stats = {};
	try {
		//get the total number of books
		const totalBooks = await Book.countDocuments();
		stats.totalBooks = totalBooks;

		//get the earliest publication year of all books
		const earliestPublicationYear = await Book.aggregate([
			{ $group: { _id: null, min: { $min: '$publicationYear' } } },
		]);
		stats.earliestPublicationYear = earliestPublicationYear[0].min;

		//get the latest publication year of all books
		const latestPublicationYear = await Book.aggregate([{ $group: { _id: null, max: { $max: '$publicationYear' } } }]);
		stats.latestPublicationYear = latestPublicationYear[0].max;

		//add functionality for an array with the number of books for each author, sorted in descending order
		const booksByAuthor = await Book.aggregate([
			{ $group: { _id: '$author', books: { $sum: 1 } } },
			{ $sort: { books: -1 } },
		]);
		stats.booksByAuthor = booksByAuthor;

		res.locals.stats = stats;

		return next();
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving stats...' });
	}
};
export default bookController;
