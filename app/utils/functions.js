const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const { SECRET_KEY, REFRESH_KEY } = require("./constansts");
const createHttpError = require("http-errors");
const fs = require("fs");
const path = require("path");

const GenerateOtpCode = () => {
  return Math.floor(Math.random() * 90000 + 1000);
};

const SignAccessToken = (userID) => {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({ _id: userID });
    const payload = {
      email: user.email,
    };
    const option = {
      expiresIn: "1y",
    };
    JWT.sign(payload, SECRET_KEY, option, (err, token) => {
      if (err) reject(createHttpError.InternalServerError("خطای سرور"));
      resolve(token);
    });
  });
};

const SignRefreshToken = (userID) => {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({ _id: userID });
    const payload = {
      email: user.email,
    };
    const option = {
      expiresIn: "5d",
    };
    JWT.sign(payload, REFRESH_KEY, option, (err, token) => {
      if (err) reject(createHttpError.InternalServerError("خطای سرور"));
      resolve(token);
    });
  });
};

const VerfiyRefreshToken = (token) => {
  return new Promise(async (resolve, reject) => {
    JWT.verify(token, REFRESH_KEY, async (err, payload) => {
      if (err)
        reject(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"));
      const { email } = payload || {};
      const user = await UserModel.findOne({ email }, { otp: 0 });
      if (!user) reject(createHttpError.Unauthorized("حساب کاربری یافت نشد"));
      resolve(email);
    });
  });
};

const deleteFileInPublic = (fileAddress) => {
  if (fileAddress) {
    const pathFile = path.join(__dirname, "..", "..", "public", fileAddress);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
  }
};

module.exports = {
  GenerateOtpCode,
  SignAccessToken,
  VerfiyRefreshToken,
  SignRefreshToken,
  deleteFileInPublic,
};
