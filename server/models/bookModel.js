import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
const Schema = mongoose.Schema;

//mongodb URI for connecting to the database, hardcoded for now, but should be stored in an environment variable (.env) for security
const DB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@erewhon.qdpiolq.mongodb.net/?retryWrites=true&w=majority&appName=Erewhon`;
//connect to the database
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
  