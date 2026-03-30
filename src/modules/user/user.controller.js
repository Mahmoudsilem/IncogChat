import { Router } from "express";
import { getUser, updateCoverPics, updateProfilePic, updateProfilePicCloud } from "./user.service.js";
import {
  cloudFileUpload,
  fileValidationFields,
  localFileUpload,
  sendResponse,
  SYS_MESSAGES,
} from "../../common/index.js";
import {
  profilePicSchema,
  userAuthentication,
  validateCoverPics,
  validateProfilePic,
} from "../../Middlewares/index.js";

const router = Router();

router.get("/", userAuthentication, async (req, res) => {
  const user = await getUser(req.user);
  sendResponse(res, user, 200, SYS_MESSAGES.user.found);
});
router.patch(
  "/profile-pic",
  userAuthentication,
  localFileUpload({
    customPath: [`users`, `profile-pic`],
    validation: fileValidationFields.image,
  }).single("profilePic"),validateProfilePic,
  async (req, res) => {
    const updatedUser = await updateProfilePic(req.user, req.file.finalPath);
    sendResponse(res, { file: req.file, user: updatedUser }, 200);
  },
);
router.patch(
  "/profile-pic-cloud",
  userAuthentication,
  cloudFileUpload({
    validation: fileValidationFields.image,
  }).single("profilePic"),validateProfilePic,
  async (req, res) => {
    const {userBeforeUpadate, porfilePic} = await updateProfilePicCloud(req.user, req.file);
    sendResponse(res, { porfilePic, user: userBeforeUpadate }, 200);
  },
);
router.patch(
  "/cover-pics",
  userAuthentication,
  localFileUpload({
    customPath: [`users`, `cover-pics`],
    validation: fileValidationFields.image,
  }).array("coverPics", 2),
  validateCoverPics,
  async (req, res) => {
    await updateCoverPics(req.user, req.files);
    sendResponse(res, { files: req.files }, 200);
  },
);
export default router;
