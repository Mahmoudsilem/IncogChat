import Joi from "joi";
import { InvalidValidationException } from "../common/index.js";
import { loginSchema, signupSchema } from "../modules/index.js";

export const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    throw new InvalidValidationException(error.details.map((d) => d.message));
  }
  next();
};
export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    throw new InvalidValidationException(error.details[0].message);
  }
  next();
};

export const genralFieldValidation = {
  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({ "string.empty": "First name is required" })
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({ "string.empty": "Last name is required" })
    .required(),
  email: Joi.string()
    .email()
    .messages({ "string.email": "Please provide a valid email address" })
    .required(),
  phone: Joi.string()
    .messages({ "string.empty": "Phone number is required" })
    .required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
    )
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
  rePassword: Joi.string()
    .valid(Joi.ref("password"))
    .messages({ "any.only": "Passwords do not match" })
    .required(),
  role: Joi.valid("0", "1").messages({
    "any.only": "Role must be either 0 (Admin) or 1 (User)",
  }),
  gender: Joi.valid("0", "1", "2").messages({
    "any.only":
      "Gender must be either 0 (Not Specified), 1 (Male), or 2 (Female)",
  }),
};
