const express = require("express");
const router = express.Router();

const {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issues");

// Get all issues
router.get("/", getIssues);

// Add an issue
router.post("/", createIssue);

// Update issue
router.put("/:id", updateIssue);

// Delete issue
router.delete("/:id", deleteIssue);

module.exports = router;
