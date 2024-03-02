const { Book } = require("../models/bookModel");

const bookController = {};

//Retrieve a list of all books. Implement pagination to limit the number of books returned per request.
bookController.getBooks = async (req, res, next) => {
  res.status(200).send("This is the books route...");
  //if a page query parameter is provided, use it to determine which page of books to return, if not, default to the first page
  const page = parseInt(req.query.page) || 1;
  //the number of books to return per page
  const limit = parseInt(req.query.limit) || 10;
  const skipPage = (page - 1) * limit;

  try {
    // const books = await Book.find().limit(limit).skip(skipPage);
    // res.status(200).json({
    //   books,
    //   totalPages: Math.ceil(books.length / limit),
    //   currentPage: page,
    // })
    res.status(200).json(books);
  } catch (err) {
    res.status(400).send("Error retrieving books...");
  }
}