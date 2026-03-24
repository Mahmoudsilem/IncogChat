import { OAuth2Client } from "google-auth-library";
import { userRepository } from "../../DB/db.repository.js";
import {
  sendEmail,
  SYS_MESSAGES,
  UnauthorizedException,
  UserProviders,
} from "../../common/index.js";
import redisRepository from "../../DB/redis.repository.js";

export async function signup(userData) {
  const { firstName, lastName, email, password, phone, role, gender } =
    userData;
    const user = { firstName, lastName, email, password, phone, role, gender };

  // user.password = undefined;
  redisRepository.set(email,user,{EX:60*60*24});
   const otp = await redisRepository.genAccVarficationOTP(email,60*60);
  sendEmail({
    to: email,
    subject:"Welcome to IncogChat",
    html:`<h1>Welcome to IncogChat</h1><p>Thank you for signing up!</p>
    <p>Your OTP for account verification is: <b>${otp}</b></p>
    <p>This OTP is valid for 1 hour.</p>`, 
  })
  return user;
}
export async function verifyAccount(email, otp) {
  const { used, varified } = await redisRepository.verifyAccVarficationOTP(email, otp);
  console.log({used, varified});
  
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
  return {createdUser, varified: true, used};
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
