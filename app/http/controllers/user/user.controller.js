const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/user");
const Controller = require("../controller");
const { deleteFileInPublic } = require("../../../utils/functions");
const path = require("path");

class UserController extends Controller {
  async getUserInfo(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        statusCode: 200,
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUser(req, res, next) {
    try {
      const userID = req.user._id;
      if (req?.body?.filename && req?.body?.fileUploadPath) {
        req.body.profile_image = path.join(
          req.body.fileUploadPath,
          req.body.filename
        );
        req.body.profile_image = req.body.profile_image.replace(/\\/g, "/");
      }
      const data = req.body;
      let badValues = [" ", "", NaN, undefined, null, 0, "0", -1];
      const fields = ["firstname", "username", "lastname", "profile_image"];
      Object.keys(data).forEach((key) => {
        console.log(fields.includes(key), ":", key);
        if (!fields.includes(key)) delete data[key];
        if (badValues.includes(data[key])) delete data[key];
      });

      const result = await UserModel.updateOne({ _id: userID }, { $set: data });
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          statusCode: 200,
          message: "کاربر با موفقیت بروززسانی شد",
        });
      }
      throw createError.InternalServerError("به روز رسانی انجام نشد");
    } catch (error) {
      deleteFileInPublic(req?.body?.profile_image);
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
