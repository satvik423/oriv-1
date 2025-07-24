const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.info("MongoDB connected"));
};

module.exports = connectDB;
