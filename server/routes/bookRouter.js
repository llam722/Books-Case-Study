const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get('/', bookController.getBooks, (req, res) => {
  res.status(200).send('ok');
});
 
module.exports = router;