const express = require("express");

const router = express.Router();
const { login, signup } = require("../controllers/auth");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

module.exports = router;
