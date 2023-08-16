const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
const connectDb = (url) => {
  return mongoose.connect(url);
};
module.exports = connectDb;
