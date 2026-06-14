import { Joi, Segments } from "celebrate";

export const createTransactionShema = {
  [Segments.BODY]: Joi.object({
    amount: Joi.number().min(1).max(9999999).required().messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least {#limit}",
      "number.max": "Age must be at most {#limit}",
      "any.required": "Age is required",
    }),
    title: Joi.string().min(3).max(60).required().messages({
      "string.base": "Name must be a string",
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should have at most {#limit} characters",
      "any.required": "Name is required",
    }),
    category: Joi.string().min(3).max(30).required().messages({
      "string.base": "Name must be a string",
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should have at most {#limit} characters",
      "any.required": "Name is required",
    }),
    type: Joi.string().valid("expense", "income").required().messages({
      "any.only": "Gender must be one of: male, female, or other",
      "any.required": "is required",
    }),
  }),
};

export const getAllTransactionSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(5).max(20).default(10),
        search: Joi.string().min(1).optional().allow(''),
        type: Joi.string().valid('income', 'expense').optional()
    }),
};
