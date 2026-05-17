const Joi = require('joi');

exports.courseSchema = Joi.object({
  title:            Joi.string().min(3).max(100).required(),
  description:      Joi.string().min(5).required(),
  fullDescription:  Joi.string().allow('').optional(),
  full_description: Joi.string().allow('').optional(),
  price:            Joi.alternatives().try(Joi.number().min(0), Joi.string()).required(),
  image:            Joi.string().allow('').optional()
});