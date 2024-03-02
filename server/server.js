const express = require("express");
const app = express();
const PORT = 3000;


const bookRouter = require("./routes/bookRouter");

//used to parse JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//route requests to bookRouter
app.use("/books", bookRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports = app;
