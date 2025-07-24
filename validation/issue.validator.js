const Joi = require("joi");

const issueValidationSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  description: Joi.string().max(100).required(),
  status: Joi.string().valid("open", "in progress", "closed").required(),
  priority: Joi.string().valid("low", "medium", "high"),
  image: Joi.string(),
});

module.exports = issueValidationSchema;
