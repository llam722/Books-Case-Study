const { Book } = require('../models/bookModel');

const bookController = {};

//Retrieve a list of all books. Implement pagination to limit the number of books returned per request.
bookController.getBooks = async (req, res, next) => {
	// res.status(200).send("This is the books route...");
	//if a page query parameter is provided, use it to determine which page of books to return, if not, default to the first page
	const page = parseInt(req.query.page) || 1;
	//the number of books to return per page
	const limit = parseInt(req.query.limit) || 5;
	const skipPage = (page - 1) * limit;

	try {
		const books = await Book.find().limit(limit).skip(skipPage);
		res.locals.books = books;
	} catch (err) {
		res.status(400).send('Error retrieving books...', err);
	}
	return next();
};

bookController.addBook = async (req, res, next) => {
	const { title, author, publicationYear } = req.body;

	if (!title) {
		return res.status(400).send('Title is required...');
	}
	if (!author) {
		return res.status(400).send('Author is required...');
	}
	if (!publicationYear) {
		return res.status(400).send('Publication year is required...');
	}

  //validation to ensure the publication year is not in the future or negative
  const currentYear = new Date().getFullYear();
  if (publicationYear > currentYear || publicationYear < 0) {
    return res.status(400).send('Publication year cannot be in the future or negative...');
  }

	try {
		const newBook = await Book.create({
			title,
			author,
			publicationYear,
		});

		res.locals.newBook = newBook;
	} catch (err) {
		res.status(400).send('Error adding book to database...', err);
	}
	return next();
};



module.exports = bookController;
