import jwt from "jsonwebtoken";
import { InvalidTokenException } from "./index.js";
import { SYS_MESSAGES } from "../index.js";

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

export function genToken2(user){
    const accessToken = genToken(user?.id || "69c2a1266db52fd860502d37", "1y", process.env.JWT_SECRET);
    const refreshToken = genToken(
      user?.id || "69c2a1266db52fd860502d37",
      60 * 60,
      process.env.JWT_SECRET_REFRESH,
    );
    return { accessToken, refreshToken };
}