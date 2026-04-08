import { SYS_MESSAGES, UserRoles, verifyToken } from "../common/index.js";
import { userRepository } from "../DB/db.repository.js";
import {
  comparePassword,
  ConflictException,
  hashPassword,
  genToken,
  encrypt,
  decrypt,
  genToken2,
  UnauthorizedException,
  NotFoundException,
  generateOTP,
  sendEmail,
  sendResponse,
} from "../common/utils/index.js";
import {
  ENCRPT_KEY,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
} from "../config/env.config.js";
import redisRepository from "../DB/redis.repository.js";

export async function signupAuthentication(req, res, next) {
  const user = await userRepository.findOne({
    filter: { email: req.body.email },
  });
  if (user) {
    throw new ConflictException(SYS_MESSAGES.user.alreadyExist);
  }
  req.body.password = await hashPassword(req.body.password);
  req.body.phone = encrypt(req.body.phone);
  req.body.role = UserRoles.User;
  next();
}
export async function loginAuthentication(req, res, next) {
  const user = await userRepository.findOne({
    filter: { email: req.body.email },
  });
  const isPasswordValid = await comparePassword(
    req.body?.password,
    user?.password || "12345674@_aA",
  );
  const { accessToken, refreshToken } = await genToken2(user);

  const decryptedPhone = decrypt(
    user?.phone || "U2FsdGVkX18ea358eCuTMeeOGHXDtDAOigAL1ZQkI51",
  );

  if (!user) {
    throw new UnauthorizedException(SYS_MESSAGES.user.invalidCredentials);
  }
  const loginAttempts = await redisRepository.get(`login_attempts:${user._id}`);
  const allowedLoginAttempts = 5;
  if (loginAttempts && +loginAttempts >= allowedLoginAttempts) {
    throw new UnauthorizedException(SYS_MESSAGES.user.accountLocked);
  }
  if (!isPasswordValid) {
    await redisRepository.increment(`login_attempts:${user._id}`);
    await redisRepository.expire(`login_attempts:${user._id}`, 60 * allowedLoginAttempts); // expire after 5 minutes
    throw new UnauthorizedException(`${SYS_MESSAGES.user.invalidCredentials} allowed attempts: ${allowedLoginAttempts - (loginAttempts ? +loginAttempts : 0)}`);
  }

  if (user.towFactorAuth) {
    // Generate and send OTP to user's phone or email
    const otp = generateOTP();
    // Send OTP to user's email
    sendEmail({
      to: user.email,
      subject: "Your OTP for Two-Factor Authentication",
      html: `<p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 1 hour.</p>`,
    });
    // Store OTP in Redis with an expiration time of 1 hour
    await redisRepository.set(`towFactorAuthOtp:${user._id}`, otp, 60 * 60); // Store OTP in Redis with an expiration time of 1 hour
    return sendResponse(res, {},200, "OTP sent to your email. Please verify to complete login.");
  }

  user.password = undefined;
  user.phone = decryptedPhone;
  req.user = user;
  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  next();
}
export async function userAuthentication(req, res, next) {
  const accessTokenPaylod = await verifyToken(
    req.headers.accesstoken,
    JWT_SECRET_ACCESS,
  );
  const refreshTokenPaylod = await verifyToken(
    req.headers.refreshtoken,
    JWT_SECRET_REFRESH,
  );
  const user = await userRepository.findOne({
    filter: { _id: refreshTokenPaylod.sub },
    select: "-provider -password -createdAt -updatedAt -__v",
  });
  if (!user) throw new NotFoundException(SYS_MESSAGES.user.notFound);

  user.phone = decrypt(user?.phone, ENCRPT_KEY);
  req.user = user;

  req.accessTokenPaylod = accessTokenPaylod;
  req.refreshTokenPaylod = refreshTokenPaylod;
  next();
}
