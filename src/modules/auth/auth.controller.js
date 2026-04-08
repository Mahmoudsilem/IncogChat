import { Router } from "express";
import { genToken2, sendResponse, SYS_MESSAGES } from "../../common/index.js";
import {
  activateTwoFactorLogin,
  login,
  logout,
  resetPassword,
  sendResetPasswordLink,
  signup,
  signupWithGmail,
  updatePassword,
  verifyAccount,
  verifyTwoFactorLogin,
} from "./auth.service.js";
import {
  loginAuthentication,
  signupAuthentication,
  userAuthentication,
} from "../../Middlewares/authentication.middleware.js";
import {
  validateLogin,
  validateSignup,
} from "../../Middlewares/validation.middleware.js";
import { incrementUsersViews } from "../user/user.service.js";
import { auth } from "google-auth-library";

const router = Router();

router.post(
  "/signup",
  validateSignup,
  signupAuthentication,
  async (req, res) => {
    const user = await signup(req.body);
    sendResponse(res, user, 201, SYS_MESSAGES.user.created);
  },
);
router.post("/verify-account", async (req, res) => {
  const { email, otp } = req.body;
  const { createdUser, varified, used } = await verifyAccount(email, otp);
  return sendResponse(
    res,
    { createdUser },
    200,
    "Account Verified Successfully",
  );
});
router.post("/login", validateLogin, loginAuthentication, async (req, res) => {
  const user = login(req.user);
  const data = {
    user,
    accessToken: req.accessToken,
    refreshToken: req.refreshToken,
  };
  await incrementUsersViews();
  sendResponse(res, data, 200, SYS_MESSAGES.user.loginSuccess);
});
router.post("/two-factor-login", async (req, res) => {
  const data = await verifyTwoFactorLogin(req.body.email, req.body.otp);
  await incrementUsersViews();
  sendResponse(res, data, 200, SYS_MESSAGES.user.loginSuccess);
});
router.post("/activate-two-factor-login",userAuthentication, async (req, res) => {
  await activateTwoFactorLogin(req.user);
  sendResponse(res, {}, 200, "Two-factor authentication activated successfully");
});
router.post("/signup/gmail", async (req, res) => {
  const { user, mass } = await signupWithGmail(req.body.idToken);
  const { accessToken, refreshToken } = await genToken2(user);

  sendResponse(res, { user, accessToken, refreshToken }, 200, mass);
});
router.post("/logout", async (req, res) => {
  await logout(req.headers.refreshtoken, req.headers.accesstoken);
  sendResponse(res, {}, 200, SYS_MESSAGES.user.logoutSuccess);
});

router.post("/send-reset-password", async (req, res) => {
  await sendResetPasswordLink(req.body.email);
  sendResponse(res, {}, 200, "Reset password link sent to your email");
});

router.patch("/reset-password", async (req, res) => {
  const { email, password, newPassword } = req.body;
  const user = await resetPassword({ email, password, newPassword });
  sendResponse(res, user, 200, SYS_MESSAGES.user.passwordReset);
});
router.patch("/update-password",userAuthentication, async (req, res) => {
  const { newPassword } = req.body;
  const user = await updatePassword(req.user, newPassword);
  sendResponse(res, user, 200, SYS_MESSAGES.user.passwordUpdated);
}); 

export default router;
