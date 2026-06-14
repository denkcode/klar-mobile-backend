import { Joi, Segments } from "celebrate";

export const registerSchema = {
    [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        username: Joi.string().min(8).max(20).required()
    }),
}

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  })
}

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required()
  })
}