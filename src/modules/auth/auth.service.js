import { userRepository } from "../../DB/db.repository.js";

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