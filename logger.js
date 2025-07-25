// logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // default level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

module.exports = logger;
