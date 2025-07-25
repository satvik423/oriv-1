const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const issuesRoute = require("./routes/issues.route");
const usersRoute = require("./routes/users.route");
const PORT = process.env.PORT;
const { connectNats } = require("./utils/nats-wrapper");
const swaggerDocs = require("./swagger");
const auth = require("./middlewares/auth");
const User = require("./models/users");
const connectDB = require("./config/db");
const roles = require("./middlewares/roles");
const authRoutes = require("./routes/auth.route");
const logger = require("./logger");
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to NATS
    await connectNats();
    app.post("/api/admin/signup", async (req, res) => {
      try {
        logger.info("Creating admin user...");
        // console.log("Creating admin user...");
        const newAdmin = new User({
          username: req.body.username,
          password: req.body.password,
          role: "admin",
        });
        await newAdmin.save();
        logger.info("New admin created:", newAdmin);
        // console.log("New admin created:", newAdmin);
        res.status(201).json({ message: "User created" });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Internal server error " + error.message });
      }
    });

    app.use("/api/auth", authRoutes);
    // Use issues route
    app.use("/api/issues", auth, issuesRoute);
    app.use("/api/users", auth, usersRoute);
    // Initialize Swagger documentation
    swaggerDocs(app);

    // app.listen
    app.listen(PORT, () => {
      logger.info(`Server is running on port http://localhost:${PORT}`);
      // console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
  }
})();
