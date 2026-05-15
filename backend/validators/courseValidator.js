const Joi = require('joi');

exports.courseSchema =
  Joi.object({

    title:
      Joi.string()

        .min(3)

        .max(100)

        .required(),

    description:
      Joi.string()

        .min(5)

        .required(),

    fullDescription:
      Joi.string()

        .allow(''),

    price:
      Joi.number()

        .min(0)

        .required(),

    image:
      Joi.string()

        .allow('')

  });