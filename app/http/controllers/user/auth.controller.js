const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/user");
const { EXPIRES_IN } = require("../../../utils/constansts");
const {
  GenerateOtpCode,
  SignAccessToken,
  SignRefreshToken,
} = require("../../../utils/functions");
const Controller = require("../controller");
const { transporter, sendEmail } = require("../../../utils/email");

class AuthController extends Controller {
  async getOtp(req, res, next) {
    try {
      const { email } = req.body;
      const code = GenerateOtpCode();
      const result = await this.saveUser(code, email);
      console.log(result);
      if (!result) throw createHttpError.Unauthorized("ورود با خطا مواجه شد");

      const test = sendEmail(email, code);
      console.log(test);
      return res.status(200).json({
        statusCode: 200,
        message: "کد اعتبار سنجی برای شما ارسال شد",
        email,
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOtp(req, res, next) {
    try {
      const { email, code } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) throw createHttpError.Unauthorized("کاربر یافت نشد");
      if (user.otp.code != code)
        throw createHttpError.Unauthorized("کد ارسال شده صحیح نمیباشد");
      const now = new Date().getTime();
      if (+user.otp.expiresIn < now)
        throw createHttpError.Unauthorized("کد شما منقضی شده است");
      const accessToken = await SignAccessToken(user._id);
      const refreshToken = await SignRefreshToken(user._id);

      return res.status(200).json({
        statusCode: 200,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const mobile = await VerifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ mobile });
      const accessToken = await SignAccessToken(user._id);
      const newRefreshToken = await SignRefreshToken(user._id);
      return res.json({
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(code, email) {
    let otp = {
      code,
      expiresIn: EXPIRES_IN,
    };
    const result = await this.checkUserExit(email);
    if (result) {
      const test = await this.updateUser(email, { otp });
      return test;
    }
    console.log(email);
    const createResult = await UserModel.create({ otp, email });
    return createResult;
  }
  async updateUser(email, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if ([" ", "", 0, null, undefined, NaN].includes(objectData[key]))
        delete objectData[key];
    });
    const updateResult = await UserModel.updateOne(
      { email },
      { $set: objectData }
    );
    return !!updateResult.modifiedCount;
  }
  async checkUserExit(email) {
    const user = await UserModel.findOne({ email });
    console.log(!!user);
    return !!user;
  }
}

module.exports = {
  AuthController: new AuthController(),
};
