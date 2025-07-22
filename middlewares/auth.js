const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "secret";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🧾 Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
