import e from "express";
import {
  cloud,
  cloudinaryUpdate,
  cloudinaryUpload,
} from "../../common/utils/multer/cloudinary.js";
import { APPLICATION_NAME } from "../../config/env.config.js";
import { userRepository } from "../../DB/db.repository.js";
import redisRepository from "../../DB/redis.repository.js";
import { UnauthorizedException, UserRoles } from "../../common/index.js";


// user services
// get user
export async function getUser(user) {
  return user;
}
// update profile pic deprecated
export async function updateProfilePic(user, file) {
  const updatedUser = await userRepository.updateOne({
    filter: { _id: user._id },
    update: { profilePic: file.finalPath, phone: "01063390058" },
  });
  return { updatedUser };
}
// update profile pic cloud
export async function updateProfilePicCloud(user, file) {
  const { public_id, secure_url } = await cloudinaryUpload({
    id: user._id,
    path: file.path,
    folderName: "users",
    subFolderName: "profile-pic",
  });
  const userBeforeUpadate = await userRepository.findOneAndUpdate({
    filter: { _id: user._id },
    update: { profilePic: { public_id, secure_url } },
    options: { returnDocument: "before" },
  });
  if (userBeforeUpadate?.profilePic?.public_id) {
    const { public_id, secure_url } = await cloudinaryUpdate({
      user: userBeforeUpadate,
      userId: userBeforeUpadate._id,
    });
    userRepository.updateOne({
      filter: { _id: user._id },
      update: { $push: { gallary: { public_id, secure_url } } },
    });
  }
  return { userBeforeUpadate, porfilePic: secure_url };
}
// delete profile pic
export async function deleteProfilePic(user) {
  //delete from cloudinary
  if (user.profilePic?.public_id) {
    await cloud().api.delete_resources([user.profilePic.public_id]);
  }
  const updatedUser = await userRepository.findOneAndUpdate({
    filter: { _id: user._id },
    update: { $unset: { profilePic: 1 } },
    options: { returnDocument: "after" },
  });
  return { updatedUser };
}
// update cover pics
export async function updateCoverPics(user, files) {
  const coverPics = user.coverPics;
  console.log(files.map((file) => file.finalPath));

  //  const updatedUser = await userRepository.updateOne({
  //   filter:{_id:user._id},
  //   update:{$set:{profilePic:files.map(file=>file.finalPath)}, phone:"01063390058"}
  // }
  const userToUpdate = userRepository.findOne({
    filter: { _id: user._id },
  });
  userToUpdate.coverPics = files.map((file) => file.finalPath);
  await user.save();
  return { userToUpdate };
}
// update cover pics cloud
export async function updateCoverPicsCloud(user, files) {
  // Upload all new files to Cloudinary in parallel
  const uploadedPics = await Promise.all(
    files.map((file) =>
      cloudinaryUpload({
        id: user._id,
        path: file.path,
        folderName: "users",
        subFolderName: "cover-pics",
      }),
    ),
  );

  const currentCoverPics = user.coverPics || [];
  const MAX_COVER_PICS = 2;

  //  Calculate how many old pics overflow the 2-pic limit
  //    e.g. user has 1, sends 2 → overflow = 1  (1 + 2 - 2 = 1 old pic goes to gallery)
  //         user has 2, sends 1 → overflow = 1  (2 + 1 - 2 = 1 old pic goes to gallery)
  //         user has 0, sends 2 → overflow = 0  (nothing goes to gallery)
  const overflow = Math.max(
    0,
    currentCoverPics.length + uploadedPics.length - MAX_COVER_PICS,
  );

  const picsToArchive = currentCoverPics.slice(0, overflow); // oldest pics → gallery
  const picsToKeep = currentCoverPics.slice(overflow); // remaining pics → stay in coverPics

  // Move overflowed old pics to gallery (Cloudinary folder + DB)
  if (picsToArchive.length > 0) {
    const archivedPics = await Promise.all(
      picsToArchive.map(async (pic) => {
        const { public_id, secure_url } = await cloud().api.update(
          pic.public_id,
          { asset_folder: `${APPLICATION_NAME}/users/${user._id}/gallary` },
        );
        return { public_id, secure_url };
      }),
    );

    await userRepository.updateOne({
      filter: { _id: user._id },
      update: {
        $push: {
          gallary: {
            $each: archivedPics.map(({ public_id, secure_url }) => ({
              public_id,
              secure_url,
            })),
          },
        },
      },
    });
  }

  //  Build the final coverPics array: kept old ones + newly uploaded
  const newCoverPics = [
    ...picsToKeep,
    ...uploadedPics.map(({ public_id, secure_url }) => ({
      public_id,
      secure_url,
    })),
  ];

  // Update user.coverPics and return the state before update (mirrors profilePic pattern)
  const userBeforeUpdate = await userRepository.findOneAndUpdate({
    filter: { _id: user._id },
    update: { coverPics: newCoverPics },
    options: { returnDocument: "before" },
  });

  return { userBeforeUpdate, coverPics: newCoverPics };
}

// increment users views this is used to track how many times users have logged in.
export async function incrementUsersViews(){
  await redisRepository.increment("usersViews");
}

// get users views,only admins can access.
export function getUsersViews(user){
  if(user.role !== UserRoles.Admin){
    throw new UnauthorizedException("Only admins can access this resource");
  }
  return redisRepository.get("usersViews");
}
