const Joi = require("@hapi/joi");

const expenseSchema = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string().max(100).required(),
  amount: Joi.number().required(),
});

module.exports = {
  expenseSchema,
};
