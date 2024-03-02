const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DB_URI =
  "mongodb+srv:louislam7229:BcKzUyCXQ2l6wTL9@erewhon.qdpiolq.mongodb.net/?retryWrites=true&w=majority&appName=Erewhon";

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Erewhon",
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log(err, 'Connection to MongoDB failed...');
  });

const Book = mongoose.model("book", bookSchema);

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: Number, required: true },
});

module.exports = {
  Book
}