import Joi from 'joi';

export const logSchema = Joi.object({
  message: Joi.string().required(),
  type: Joi.string().valid('error', 'info', 'verbose').required(),
  timestamp: Joi.date().default(new Date()),
});

export const timeRangeSchema = Joi.object({
  startTime: Joi.date().required(),
  endTime: Joi.date().required().greater(Joi.ref('startTime')),
});