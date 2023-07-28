const Jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../utils/constansts");
const createHttpError = require("http-errors");
const { UserModel } = require("../../models/user");

const VerifyAccessToken = (req, res, next) => {
  const headers = req.headers;
  const [bearer, token] = headers?.["access-token"]?.split(" ") || [];
  if (token && ["Bearer", "bearer"].includes(bearer)) {
    Jwt.verify(token, SECRET_KEY, async (err, payload) => {
      if (err)
        return next(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"));
      const { email } = payload || {};
      const user = await UserModel.findOne({ email });
      if (!user) return next(createHttpError.NotFound("حساب کاربری یافت نشد"));
      req.user = user;
      return next();
    });
  } else {
    return next(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"));
  }
};

module.exports = {
  VerifyAccessToken,
};
