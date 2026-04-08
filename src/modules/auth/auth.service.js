import { OAuth2Client } from "google-auth-library";
import { userRepository } from "../../DB/db.repository.js";
import {
  genToken,
  genToken2,
  genUUID,
  hashPassword,
  sendEmail,
  SYS_MESSAGES,
  UnauthorizedException,
  UserProviders,
  verifyToken,
} from "../../common/index.js";
import redisRepository from "../../DB/redis.repository.js";
import {
  ENCRPT_KEY,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
} from "../../config/env.config.js";

export async function signup(userData) {
  const { firstName, lastName, email, password, phone, role, gender } =
    userData;
  const user = { firstName, lastName, email, password, phone, role, gender };

  // user.password = undefined;
  redisRepository.set(email, user, { EX: 60 * 60 * 24 });
  const otp = await redisRepository.genAccVarficationOTP(email, 60 * 60);
  sendEmail({
    to: email,
    subject: "Welcome to IncogChat",
    html: `<h1>Welcome to IncogChat</h1><p>Thank you for signing up!</p>
    <p>Your OTP for account verification is: <b>${otp}</b></p>
    <p>This OTP is valid for 1 hour.</p>`,
  });
  return user;
}
export async function verifyAccount(email, otp) {
  const { used, varified } = await redisRepository.verifyAccVarficationOTP(
    email,
    otp,
  );

  if (used) {
    throw new UnauthorizedException(SYS_MESSAGES.otp.otpUsed);
  }
  if (!varified) {
    throw new UnauthorizedException(SYS_MESSAGES.otp.invalid);
  }
  const user = await redisRepository.get(email);
  const { firstName, lastName, password, phone, role, gender } = user;
  const createdUser = await userRepository.createOne({
    data: { firstName, lastName, email, password, phone, role, gender },
  });
  return { createdUser, varified: true, used };
}
export function login(user) {
  return user;
}
async function verifyGmailToken(idToken) {
  const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);

  const ticket = await client.verifyIdToken({ idToken });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw new UnauthorizedException("Email not verified");
  }
  return payload;
}
export async function signupWithGmail(idToken) {
  const payload = await verifyGmailToken(idToken);
  const { email, given_name, family_name } = payload;
  const user = await userRepository.findOne({ filter: { email } });
  if (user && user.provider == UserProviders.Google) {
    //login user
    await loginWithGmail(user);
    return { user, mass: SYS_MESSAGES.user.loginSuccess };
  }
  if (user && user.provider == UserProviders.system) {
    throw new UnauthorizedException(SYS_MESSAGES.user.systemLogedInNotGoogle);
  }
  const newUser = await userRepository.createOne({
    data: {
      email,
      firstName: given_name,
      lastName: family_name,
      provider: UserProviders.Google,
      conformEmail: new Date(),
    },
  });
  return { user: newUser, mass: SYS_MESSAGES.user.userCreated };
}
async function loginWithGmail(user) {
  return await userRepository.findOne({ filter: { email: user.email } });
}
export async function logout(refreshToken, accessToken) {
  const refreshTokenPayload = await verifyToken(
    refreshToken,
    JWT_SECRET_REFRESH,
  );
  const accessTokenPayload = await verifyToken(accessToken, JWT_SECRET_ACCESS);
  // blacklist the access token
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  const accessTokenTtl = +accessTokenPayload.exp - now;
  const refreshTokenTtl = +refreshTokenPayload.exp - now;

  await redisRepository.set(
    `bl_accToken:${accessTokenPayload.jti}`,
    `${accessTokenPayload.jti}`,
    {
      EX: accessTokenTtl,
    },
  );
  await redisRepository.set(
    `bl_refToken:${refreshTokenPayload.jti}`,
    `${refreshTokenPayload.jti}`,
    {
      EX: refreshTokenTtl,
    },
  );
}
export async function activateTwoFactorLogin(user) {
  // Implement your logic to activate two-factor authentication for the user
  user.towFactorAuth = true;
  await user.save();
}
export async function verifyTwoFactorLogin(email, otp) {
  const user = await userRepository.findOne({ filter: { email } });
  if (!user) {
    throw new UnauthorizedException(SYS_MESSAGES.user.notFound);
  }
  // Implement your logic to verify the OTP sent to the user's email or phone
  const userOtp = await redisRepository.get(`towFactorAuthOtp:${user._id}`);
  if (userOtp != otp) {
    throw new UnauthorizedException("Invalid OTP");
  }
  await redisRepository.del(`towFactorAuthOtp:${user._id}`);
  const { accessToken, refreshToken } = await genToken2(user);
  user.password = undefined;
  user.phone = decrypt(user?.phone, ENCRPT_KEY);
  // You can retrieve the OTP from Redis and compare it with the OTP provided by the user
  return { user, accessToken, refreshToken }; // Return true if OTP is valid, otherwise return false
}
export async function sendResetPasswordLink(email) {
  const user = await userRepository.findOne({ filter: { email } });
  if (!user) {
    throw new UnauthorizedException("User not found");
  }
  const password = genUUID();
  await redisRepository.set(`resetPass:${email}`, password, { EX: 60 * 15 });
  sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h1>Reset Password</h1>
    <p>Your temporary password is: <b>${password}</b></p>
    <p>Use this password to reset your password.</p>
    <p>This password is valid for 15 minutes.</p>`,
  });
}

export async function resetPassword({ email, password, newPassword }) {
  const tempPassword = await redisRepository.get(`resetPass:${email}`);
  if (tempPassword !== password) {
    throw new UnauthorizedException("Invalid password reset password");
  }
  await redisRepository.del(`resetPass:${email}`);
  const user = await userRepository.findOne({ filter: { email } });
  if (!user) {
    throw new UnauthorizedException("User not found");
  }
  user.password = await hashPassword(newPassword);
  await user.save();
  return user;
}
export async function updatePassword(user, newPassword) {
  user.password = await hashPassword(newPassword);
  await user.save();
  user.password = undefined;
  return user;
}