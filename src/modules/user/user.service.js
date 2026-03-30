import { cloudFileUpload } from "../../common/index.js";
import {
  cloud,
  cloudinaryUpdate,
  cloudinaryUpload,
} from "../../common/utils/multer/cloudinary.js";
import { APPLICATION_NAME } from "../../config/env.config.js";
import { userRepository } from "../../DB/db.repository.js";
export async function getUser(user) {
  return user;
}

export async function updateProfilePic(user, file) {
  const updatedUser = await userRepository.updateOne({
    filter: { _id: user._id },
    update: { profilePic: file.finalPath, phone: "01063390058" },
  });
  console.log(user._id);

  return { updatedUser };
}
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
    // const { public_id, secure_url } = await cloud().api.update(
    //   userBeforeUpadate.profilePic.public_id,
    //   {
    //     asset_folder: `${APPLICATION_NAME}/users/${user._id}/gallary`,
    //   },
    // );
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
export async function updateCoverPicsCloud(user, files) {
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
