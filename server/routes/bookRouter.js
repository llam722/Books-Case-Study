const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get('/', bookController.getBooks, (req, res) => {
  res.status(200).json(res.locals.books);
});

router.post('/', bookController.addBook, (req, res) => {
  res.status(201).json(res.locals.newBook);
});
 
module.exports = router;