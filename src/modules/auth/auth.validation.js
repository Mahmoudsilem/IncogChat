import Joi from "joi";
import { genralFieldValidation } from "../../Middlewares/validation.middleware.js";

export const signupSchema = Joi.object({
  firstName: genralFieldValidation.firstName,
  lastName: genralFieldValidation.lastName,
  email: genralFieldValidation.email,
  phone: genralFieldValidation.phone,
  password: genralFieldValidation.password,
  rePassword: genralFieldValidation.rePassword,
  role: genralFieldValidation.role,
  gender: genralFieldValidation.gender,
});
  

export const loginSchema = Joi.object({
  email: genralFieldValidation.email,
  password: genralFieldValidation.password,
});