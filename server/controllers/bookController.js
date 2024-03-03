const { Book } = require('../models/bookModel');

const bookController = {};

//Retrieve a list of all books. Implement pagination to limit the number of books returned per request.
bookController.getBooks = async (req, res, next) => {
	// res.status(200).send("This is the books route...");
	//if a page query parameter is provided, use it to determine which page of books to return, if not, default to the first page
	const page = parseInt(req.query.page) || 1;
	//the number of books to return per page, defaulted to 5
	const limit = parseInt(req.query.limit) || 5;
	const skipPage = (page - 1) * limit;

	try {
		const books = await Book.find().limit(limit).skip(skipPage);
		res.locals.books = books;
		return next();
	} catch (err) {
		res.status(400).send('Error retrieving books...');
	}
};

//Retrieve details of a specific book by ID.
bookController.getBookById = async (req, res, next) => {
	const { id } = req.params;

	if (!id) return res.status(400).send('Book ID is required...');

	try {
		const book = await Book.findById(id);
		res.locals.book = book;
		return next();
	} catch (err) {
		res.status(400).send('Error retrieving book, check if id is correct...');
	}
};

//Add a new book to the collection. Implement input validation to ensure all required fields are provided (`title`, `author`, `publicationYear`), and `publicationYear` should be a valid year in the past.
bookController.addBook = async (req, res, next) => {
	const { title, author, publicationYear } = req.body;

	//created error array to in case multiple fields are missing
	const errors = [];

	if (!title || typeof title !== 'string')                    errors.push('Title is required or must be a string...');
	if (!author || typeof author !== 'string')                  errors.push('Author is missing or must be a string...');
	if (!publicationYear|| typeof publicationYear !== 'number') errors.push('Publication year is missing or must be a number...');

	if (errors.length > 0) return res.status(400).json({ errors });

	//ensure the publication year is not in the future or negative
	const currentYear = new Date().getFullYear();
	if (publicationYear > currentYear || publicationYear < 0) {
    errors.push('Publication year cannot be in the future or negative...');
    return res.status(400).json({ errors });
	}

	try {
		const newBook = await Book.create({
			title,
			author,
			publicationYear,
		});

		res.locals.newBook = newBook;
		return next();
	} catch (err) {
		res.status(400).send('Error adding book to database...');
	}
};


//Update details of a specific book by ID. Allow partial updates, and ensure validation is applied to the input data.
bookController.updateBook = async (req, res, next) => {
  const { id } = req.params;
  const { title, author, publicationYear } = req.body;
  const errors = [];

	if (!req.body || Object.keys(req.body).length === 0) {
    errors.push('No data provided to update book...');
    return res.status(400).json({ errors });
  }
  //validation to ensure the publication year is not in the future or negative
  	const currentYear = new Date().getFullYear();
		if (publicationYear > currentYear || publicationYear < 0) {
			errors.push('Publication year cannot be in the future or negative...');
			return res.status(400).json({ errors });
		}

	try {
		const book = await Book.findById(id);
		//if the book does not exist, return an error
    if (!book) {
      errors.push('Book does not exist...')
      return res.status(400).json({ errors })
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
		res.status(400).send('Error updating book...');
	}
};

module.exports = bookController;
