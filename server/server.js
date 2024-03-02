const express = require("express");
const app = express();
const PORT = 3000;

//used to parse JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Retrieve a list of all books. Implement pagination to limit the number of books returned per request.
app.get("/books", (req, res) => {
  res.status(200).send("This is the books route...");
  //if a page query parameter is provided, use it to determine which page of books to return, if not, default to the first page
  const page = parseInt(req.query.page) || 1;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports = app;
