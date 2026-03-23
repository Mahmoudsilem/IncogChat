import { OAuth2Client } from "google-auth-library";
import { userRepository } from "../../DB/db.repository.js";
import {
  SYS_MESSAGES,
  UnauthorizedException,
  UserProviders,
} from "../../common/index.js";

export async function signup(userData) {
  const { firstName, lastName, email, password, phone, role, gender } =
    userData;
  const user = await userRepository.createOne({
    data: { firstName, lastName, email, password, phone, role, gender },
  });
  user.password = undefined;
  return user;
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
