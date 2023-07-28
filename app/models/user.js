const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile_image: {
      type: String,
      required: false,
      default: "default.png",
    },
    otp: {
      type: Object,
      default: {
        expiresIn: 0,
        code: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  UserModel: mongoose.model("user", Schema),
};
