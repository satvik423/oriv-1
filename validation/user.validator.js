const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().alphanum().min(8).max(10).required(),
  role: Joi.string(),
});

module.exports = userValidationSchema;
