import { Router } from "express";
import { sendResponse } from "../../common/utils/api-response.js";
import { SYS_MESSAGES } from "../../common/constants/messages.constants.js";
import { getAllMassages, getSpecificMassage, sendMassage } from "./massage.service.js";
import { cloudFileUpload, fileValidationFields } from "../../common/index.js";
import { userAuthentication } from "../../Middlewares/authentication.middleware.js";

const router = new Router();

router.post("/:receiverId/anonymous",
    cloudFileUpload({
    validation: fileValidationFields.image,
    fileSize: 5
}).array("attachments", 2), async (req, res) => {
    const { receiverId:recevier } = req.params;    
    const { content } = req.body;
    const massage = await sendMassage({recevier, content},req.files);
    sendResponse(res, {massage}, 200, SYS_MESSAGES.massage.userCreated);
})
router.post("/:receiverId/public",userAuthentication,
    cloudFileUpload({
    validation: fileValidationFields.image,
    fileSize: 5
}).array("attachments", 2), async (req, res) => {
    const { receiverId:recevier } = req.params;    
    const { content } = req.body;
    const massage = await sendMassage({recevier, content, sender: req.user._id},req.files);
            sendResponse(res, {massage}, 200, SYS_MESSAGES.massage.userCreated);
})
router.get("/:massageId",userAuthentication, async (req, res) => {
    const { massageId } = req.params;
    const massage = await getSpecificMassage(massageId,req.user._id);
    sendResponse(res, {massage}, 200, SYS_MESSAGES.massage.found);
})
router.get("/",userAuthentication, async (req, res) => {
    const massages = await getAllMassages(req.user);
    sendResponse(res, {massages}, 200, SYS_MESSAGES.massage.found);
})


export default router;