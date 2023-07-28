const {
  UserController,
} = require("../../http/controllers/user/user.controller");
const {
  VerifyAccessToken,
} = require("../../http/middlewares/verify_access_token");
const { upload } = require("../../utils/multer");

const router = require("express").Router();

router.post(
  "/update-user",
  upload.single("file"),
  VerifyAccessToken,
  UserController.updateUser
);
router.get("/profile", VerifyAccessToken, UserController.getUserInfo);

module.exports = {
  UserRouter: router,
};
