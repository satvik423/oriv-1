const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
    expiresIn: "1w",
  });
  console.log(token);
  res.json({ token });
};

module.exports = { signup, login };
