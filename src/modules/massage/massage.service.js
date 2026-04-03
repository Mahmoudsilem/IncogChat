import { BadRequestException, SYS_MESSAGES } from "../../common/index.js";
import { cloudinaryUpload } from "../../common/utils/multer/cloudinary.js";
import { massageRepository, userRepository } from "../../DB/db.repository.js";

export async function sendMassage(
  { recevier, content, sender = undefined },
  files,
) {
  if (!(await userRepository.findOne({ filter: { _id: recevier } }))) {
    throw new BadRequestException("Recevier not found");
  }
  let uploadedPics = [];
  if (files?.length != 0) {
    uploadedPics = await Promise.all(
      files.map((file) =>
        cloudinaryUpload({
          id: recevier,
          path: file.path,
          folderName: "massages",
          subFolderName: "attachments",
        }),
      ),
    );
  }

  return await massageRepository.createOne({
    data: {
      content,
      recevier,
      attachments: uploadedPics,
      sender,
    },
  });
}
export async function getSpecificMassage(massgeId, userId) {
  const massage = await massageRepository.findOne({
    filter: { _id: massgeId, $or: [{ sender: userId }, { recevier: userId }] },
    options: {
      populate: [
        { path: "recevier", select: "firstName lastName profilePic email" },
      ],
    },
  });
  if (!massage) {
    throw new BadRequestException(SYS_MESSAGES.massage.notFound);
  }
}
export async function getAllMassages(user) {
  const massages = await massageRepository.find({
    filter: {
      $or: [{ sender: user._id }, { recevier: user._id }],
    },
    options: {
      populate: [
        { path: "recevier", select: "firstName lastName profilePic email" },
        { path: "sender", select: "firstName lastName profilePic email" },
      ],
    },
  });
  if (!massages.length) {
    throw new BadRequestException("No massages found");
  }
  return massages;
}
