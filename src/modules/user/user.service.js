
export async function getUser(user) {
  return user;
}

export async function updateProfilePic(user,file) {
  const profilePic = user.profilePic
  user.select("-phone").profilePic = file
  await user.save()
  return {user}
}
export async function updateCoverPics(user,files) {
  const coverPics = user.coverPics  
  user.coverPics = files.map(file=>file.finalPath);
  await user.save();
  return {user}
}