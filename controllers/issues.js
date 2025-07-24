const Issue = require("../models/issues");
// Publish event to NATS
const { getNatsConnection } = require("../utils/nats-wrapper");
const issueValidationSchema = require("../validation/issue.validator");

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    const nc = getNatsConnection();
    const finalIssue = issues.map((issue) => {
      const issueObj = issue.toObject();
      if (issueObj.image) {
        issueObj.image = `http://localhost:5000/${issueObj.image.replace(
          "\\",
          "/"
        )}`;
      }
      return issueObj;
    });
    nc.publish("issues.retrieved", JSON.stringify(finalIssue));
    // console.log("Retrieved issues:", issues);
    res.status(200).json(finalIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIssue = async (req, res) => {
  try {
    const issueData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "open",
      priority: req.body.priority || "medium",
      image: req.file?.path,
    };

    if (req.file) {
      issueData.image = req.file.path.replace(/\\/g, "/");
    }
    const { error, value } = issueValidationSchema.validate(issueData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const issue = new Issue(value);
    const saved = await issue.save();
    const nc = getNatsConnection();
    nc.publish("issue.created", JSON.stringify(saved));
    res.status(201).json(saved);
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
    // console.log("Issue deleted:", issue);
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
