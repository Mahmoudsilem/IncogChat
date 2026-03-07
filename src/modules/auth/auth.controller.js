import { Router } from "express";
import { sendResponse } from "../../utils/api-response.js";
import { SYS_MESSAGES } from "../../common/index.js";
import { login, signup } from "./auth.service.js";
import { loginAuthentication, signupAuthentication } from "../../Middlewares/authentication.middleware.js";


const router = Router();

router.post("/signup",signupAuthentication, async (req, res) => {
    const user = await signup(req.body);
    sendResponse(res, user, 201, SYS_MESSAGES.user.created);
})
router.post("/login", loginAuthentication, (req, res) => {
    const user = login(req.user);
    const data = {
        user,
        token: req.token,
    }
    sendResponse(res, data, 200, SYS_MESSAGES.user.loginSuccess);
});

export default router;
