const Joi = require("@hapi/joi");

const getOtpSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const checkOtpSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  code: Joi.string()
    .min(4)
    .max(6)
    .error(new Error("کد ارسال شده صحیح نمیباشد")),
});

module.exports = {
  getOtpSchema,
  checkOtpSchema,
};
