import mongoose from "mongoose";


const Schema = mongoose.Schema;

const DB_URI =
  "mongodb+srv://louislam7229:weyGIDgLqyE1CIDc@erewhon.qdpiolq.mongodb.net/?retryWrites=true&w=majority&appName=Erewhon";

mongoose
  .connect(DB_URI, {
    dbName: "Erewhon",
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log(err, 'Connection to MongoDB failed...');
  });

  
  const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationYear: { type: Number, required: true },
  });

export const Book = mongoose.model("Book", bookSchema);
