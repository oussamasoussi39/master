require("dotenv").config();
require("express-async-errors")
const connectDb = require("./db/connect");
const express = require("express");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");
const authRouter = require("./routes/authRoutes");
const cookieParser=require("cookie-parser")
const app = express();
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())
app.use("/api/v1/auth", authRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);
const Port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(Port, console.log(`server is running on port ${Port}`));
  } catch (err) {
    throw err;
  }
};
start();
