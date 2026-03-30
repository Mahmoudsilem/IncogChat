import { v2 as cloudinary } from "cloudinary";
import {
  APPLICATION_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../../../config/env.config.js";

export function cloud() {
  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}
export async function cloudinaryUpload({
  id,
  path,
  folderName,
  subFolderName,
}) {
  const { public_id, secure_url } = await cloud().uploader.upload(path, {
    folder: `${APPLICATION_NAME}/${folderName}/${id}/${subFolderName}`,
  });
  return { public_id, secure_url };
}
export async function cloudinaryUpdate({user, userId}) {
  const { public_id, secure_url } = await cloud().api.update(
    user.profilePic.public_id,
    {
      asset_folder: `${APPLICATION_NAME}/users/${userId}/gallary`,
    },
  );
  return { public_id, secure_url };
}
