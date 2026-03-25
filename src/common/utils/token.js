import jwt from "jsonwebtoken";
import { InvalidTokenException } from "./index.js";
import { SYS_MESSAGES } from "../index.js";
import { randomByts } from "./index.js";
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from "../../config/index.js";
import redisRepository from "../../DB/redis.repository.js";

export function genToken(
  sub,
  expiresIn = 60 * 60,
  key = process.env.JWT_SECRET,
) {
  const paylode = {
    sub,
    // jti: randomByts(16),
  };
  return jwt.sign(paylode, key, { expiresIn });
}
// genrate access token and refresh token
export async function genToken2(user) {
  const refreshTokenPaylode = {
    sub: user?.id || "69c2a1266db52fd860502d37",
    jti: randomByts(16),
    type: "refresh",
  };
  const accessTokenPaylode = {
    sub: user?.id || "69c2a1266db52fd860502d37",
    jti: randomByts(16),
    type: "access",
  };
  const refreshToken = jwt.sign(refreshTokenPaylode, JWT_SECRET_REFRESH, {
    expiresIn: 60 * 60,
  });
  const accessToken = jwt.sign(accessTokenPaylode, JWT_SECRET_ACCESS, {
    expiresIn: "1y",
  });
  return { refreshToken, accessToken };
}

export async function verifyToken(token, key) {
  try {
  const paylode = jwt.verify(token, key);


    const blAccToken = await redisRepository.get(
      `bl_accToken:${paylode.jti}`,
    );
    const blRefToken = await redisRepository.get(
      `bl_refToken:${paylode.jti}`,
    );
    if (blAccToken || blRefToken){
      throw new InvalidTokenException(SYS_MESSAGES.token.revoked);
    } 
    return paylode;
  } 
  catch (error) {
    throw new InvalidTokenException(SYS_MESSAGES.token.invalid);
  }
}
 