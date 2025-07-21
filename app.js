const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const issuesRoute = require("./routes/issues.route");
const PORT = process.env.PORT;
const { connectNats } = require("./utils/nats-wrapper");
app.use(express.json());

(async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB connection error:", err));

    // Connect to NATS
    await connectNats();

    // Use issues route
    app.use("/api/issues", issuesRoute);

    // app.listen
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
  }
})();
