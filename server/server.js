import express from "express";
import bookRouter from "./routes/bookRouter.js";


const app = express();
const PORT = 3000;


//used to parse JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//route requests to bookRouter
app.use("/books", bookRouter);

//catch all for unknown routes
app.use("*", (req, res) => {
  return res.status(404).send("The page you are looking for does not exist.");
});

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "GLOBAL ERROR HANDLER: caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj)
  return res.status(errorObj.status).json(errorObj.message);
});

//start server and listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

export default app;

