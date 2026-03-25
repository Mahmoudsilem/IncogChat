import {
  NotFoundException,
  SYS_MESSAGES,
  verifyToken,
} from "../../common/index.js";
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from "../../config/index.js";
import { userRepository } from "../../DB/db.repository.js";

export async function getUser(accessToken,refreshToken) {
  const accessTokenPaylod = await verifyToken(accessToken, JWT_SECRET_ACCESS);
  const refreshTokenPaylod = await verifyToken(refreshToken, JWT_SECRET_REFRESH);  
  const user = await userRepository.findOne({
    filter: { _id: refreshTokenPaylod.sub },
    select: "email firstName lastName role phone",
  });  
  if (!user) throw new NotFoundException(SYS_MESSAGES.user.notFound);
  return user;
}
