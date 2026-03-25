import { Router } from "express";
import { getUser } from "./user.service.js";
import { sendResponse, SYS_MESSAGES } from "../../common/index.js";

const router = Router();

router.get("/", async (req, res) => {
    const user = await getUser(req.headers.accesstoken, req.headers.refreshtoken);
    sendResponse(res, user, 200, SYS_MESSAGES.user.found);
});

export default router;