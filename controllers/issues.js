const Issue = require("../models/issues");
// Publish event to NATS
const { getNatsConnection } = require("../utils/nats-wrapper");

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    const nc = getNatsConnection();
    nc.publish("issues.retrieved", JSON.stringify(issues));
    // console.log("Retrieved issues:", issues);
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIssue = async (req, res) => {
  try {
    const issue = new Issue(req.body);
    const saved = await issue.save();
    const nc = getNatsConnection();
    nc.publish("issue.created", JSON.stringify(saved));
    // console.log("Issue created:", issue);
    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const nc = getNatsConnection();
    nc.publish("issue.updated", JSON.stringify(issue));
    // console.log("Issue updated:", issue);
    res.status(200).json(issue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    const nc = getNatsConnection();
    nc.publish("issue.deleted", JSON.stringify(issue));
    console.log("Issue deleted:", issue);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
};
