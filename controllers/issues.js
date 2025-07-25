require("../trace");
const Issue = require("../models/issues");
const { getNatsConnection } = require("../utils/nats-wrapper");
const issueValidationSchema = require("../validation/issue.validator");
const { trace } = require("@opentelemetry/api");

const tracer = trace.getTracer("issue-tracer");

const getIssues = async (req, res) => {
  const span = tracer.startSpan("getIssues");
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
    res.status(200).json(finalIssue);
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
};

const createIssue = async (req, res) => {
  const span = tracer.startSpan("createIssue");
  try {
    const issueData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "open",
      priority: req.body.priority || "medium",
      image: req.file?.path?.replace(/\\/g, "/"),
    };

    const { error, value } = issueValidationSchema.validate(issueData);
    if (error) {
      span.setStatus({ code: 1, message: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const issue = new Issue(value);
    const saved = await issue.save();

    const nc = getNatsConnection();
    nc.publish("issue.created", JSON.stringify(saved));

    res.status(201).json(saved);
  } catch (error) {
    span.recordException(error);
    res.status(400).json({ error: error.message });
  } finally {
    span.end();
  }
};

const updateIssue = async (req, res) => {
  const span = tracer.startSpan("updateIssue");
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const nc = getNatsConnection();
    nc.publish("issue.updated", JSON.stringify(issue));
    res.status(200).json(issue);
  } catch (error) {
    span.recordException(error);
    res.status(400).json({ error: error.message });
  } finally {
    span.end();
  }
};

const deleteIssue = async (req, res) => {
  const span = tracer.startSpan("deleteIssue");
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    const nc = getNatsConnection();
    nc.publish("issue.deleted", JSON.stringify(issue));
    res.status(204).send();
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
};

module.exports = {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
};
