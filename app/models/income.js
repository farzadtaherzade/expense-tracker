const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "income",
      required: false,
    },
    description: {
      type: String,
      required: false,
      maxLength: 100,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      requred: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  IncomeModel: mongoose.model("income", Schema),
};
