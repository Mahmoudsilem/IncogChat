import { SYS_MESSAGES, UserRoles } from "../common/index.js";
import { userRepository } from "../DB/db.repository.js";
import {
  comparePassword,
  ConflictException,
  hashPassword,
  genToken,
  encrypt,
  decrypt,
  genToken2,
} from "../common/utils/index.js";

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
    req.body.password,
    user.password,
  );
  const { accessToken, refreshToken } = genToken2(user);

  user.phone = decrypt(user.phone);

  if (!user) {
    throw new NotFoundException(SYS_MESSAGES.user.notFound);
  }
  if (!isPasswordValid) {
    throw new UnauthorizedException(SYS_MESSAGES.auth.invalidCredentials);
  }
  user.password = undefined;
  req.user = user;
  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  next();
}
