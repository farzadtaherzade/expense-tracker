const Joi = require("@hapi/joi");

const incomeSchema = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string().max(100).required(),
  amount: Joi.number().required(),
});

module.exports = {
  incomeSchema,
};
