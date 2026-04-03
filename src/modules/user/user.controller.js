import { Router } from "express";
import {
  deleteProfilePic,
  getUser,
  getUsersViews,
  updateCoverPics,
  updateCoverPicsCloud,
  updateProfilePic,
  updateProfilePicCloud,
} from "./user.service.js";
import {
  cloudFileUpload,
  fileValidationFields,
  localFileUpload,
  sendResponse,
  SYS_MESSAGES,
} from "../../common/index.js";
import {
  userAuthentication,
  validateCoverPics,
  validateProfilePic,
} from "../../Middlewares/index.js";

const router = Router();

router.get("/", userAuthentication, async (req, res) => {
  const user = await getUser(req.user);
  sendResponse(res, user, 200, SYS_MESSAGES.user.found);
});
// profile pic
router.patch(
  "/profile-pic",
  userAuthentication,
  localFileUpload({
    customPath: [`users`, `profile-pic`],
    validation: fileValidationFields.image,
  }).single("profilePic"),
  validateProfilePic,
  async (req, res) => {
    const updatedUser = await updateProfilePic(req.user, req.file.finalPath);
    sendResponse(res, { file: req.file, user: updatedUser }, 200);
  },
);
// profile pic cloud
router.patch(
  "/profile-pic-cloud",
  userAuthentication,
  cloudFileUpload({
    validation: fileValidationFields.image,
  }).single("profilePic"),
  validateProfilePic,
  async (req, res) => {
    const { userBeforeUpadate, porfilePic } = await updateProfilePicCloud(
      req.user,
      req.file,
    );
    sendResponse(res, { porfilePic, user: userBeforeUpadate }, 200);
  },
);
//remove profile pic
router.delete(
  "/profile-pic-cloud",
  userAuthentication,
  async (req, res) => {
    const user = await deleteProfilePic(req.user);
    sendResponse(res, { user }, 200, SYS_MESSAGES.user.profilePicDeleted);
  });
// cover pics
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
// cover pics cloud
router.patch(
  "/cover-pics-cloud",
  userAuthentication,
  cloudFileUpload({
    validation: fileValidationFields.image,
  }).array("coverPics", 2),
  validateCoverPics,
  async (req, res) => {
    const { coverPics } = await updateCoverPicsCloud(req.user, req.files);
    sendResponse(res, { coverPics }, 200, SYS_MESSAGES.user.coverPicsUpdated);
  },
);

// get users views,only admins can access.
router.get(
  "/views",
  userAuthentication,
  async (req, res) => {
    const usersViews = await getUsersViews(req.user);
    sendResponse(res, { usersViews }, 200);
  });
export default router;
