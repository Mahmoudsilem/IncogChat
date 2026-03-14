import { Router } from "express";
import { sendResponse, SYS_MESSAGES } from "../../common/index.js";
import { login, signup } from "./auth.service.js";
import {
  loginAuthentication,
  signupAuthentication,
} from "../../Middlewares/authentication.middleware.js";
import { validateLogin, validateSignup } from "../../Middlewares/validation.middleware.js";

const router = Router();

router.post("/signup", validateSignup, signupAuthentication, async (req, res) => {
  const user = await signup(req.body);
  sendResponse(res, user, 201, SYS_MESSAGES.user.created);
});
router.post("/login", validateLogin, loginAuthentication, (req, res) => {
  const user = login(req.user);
  const data = {
    user,
    token: req.token,
    refreshToken: req.refreshToken,
  };
  sendResponse(res, data, 200, SYS_MESSAGES.user.loginSuccess);
});

export default router;
