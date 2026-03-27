import { Router } from "express";
import { getUser, updateCoverPics, updateProfilePic } from "./user.service.js";
import {
    fileValidationFields,
  localFileUpload,
  sendResponse,
  SYS_MESSAGES,
} from "../../common/index.js";
import { userAuthentication } from "../../Middlewares/index.js";

const router = Router();

router.get("/", userAuthentication, async (req, res) => {
  const user = await getUser(req.user);
  sendResponse(res, user, 200, SYS_MESSAGES.user.found);
});
router.patch(
  "/profile-pic",
  userAuthentication,
  localFileUpload({customPath:[`users`,`profile-pic`],
    validation:fileValidationFields.image
}).single("profilePic"),
  async (req, res) => {
    updateProfilePic(req.user,req.file.finalPath)
    sendResponse(res, { file: req.file, user: req.user }, 200);
  },
);
router.patch(
  "/cover-pics",
  userAuthentication,
  localFileUpload({customPath:[`users`,`cover-pics`],
    validation:fileValidationFields.image
}).array("coverPics", 2),
  async (req, res) => {    
    updateCoverPics(req.user,req.files)
    sendResponse(res, { files: req.files }, 200);
  },
);
export default router;
