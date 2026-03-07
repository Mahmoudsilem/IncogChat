import jwt from "jsonwebtoken";
import { SYS_MESSAGES } from "../common/index.js";
import { InvalidTokenException } from "./error.utils.js";

export function genToken(sub,expiresIn = 60 * 60, key = process.env.JWT_SECRET) {
  return jwt.sign({ sub }, key, { expiresIn });
}
export function verifyToken(token, key = process.env.JWT_SECRET) {
  try {
    const data = jwt.verify(token, key);
    return data;
  } catch (error) {
    throw new InvalidTokenException(SYS_MESSAGES.token.invalid);
  }
}