const createHttpError = require("http-errors");
const { IncomeModel } = require("../../../models/income");
const Controller = require("../controller");
const { incomeSchema } = require("../../validators/api/income.schema");

class IncomeController extends Controller {
  async getAllIncome(req, res, next) {
    try {
      const userID = req.user._id;
      const incomes = await IncomeModel.find({ owner: userID });
      let totalIncome = 0;
      incomes.forEach((income) => {
        totalIncome += income.amount;
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          incomes,
          totalIncome,
          length: incomes.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getIncomes(req, res, next) {
    try {
      const userID = req.user._id;
      const incomes = await IncomeModel.find({ owner: userID });
      return res.status(200).json({
        statusCode: 200,
        length: incomes.length,
        data: {
          incomes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async createNewIncome(req, res, next) {
    try {
      await incomeSchema.validateAsync();
      const userID = req.user._id;
      const { title, description, amount } = req.body;
      const result = await IncomeModel.create({
        title,
        amount,
        owner: userID,
        type: "income",
        description,
      });
      if (!result) throw createHttpError.BadRequest();
      res.status(201).json({
        statusCode: 201,
        message: "درآمد با موفقیت ایجاد شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async removeIncome(req, res, next) {
    try {
      const userID = req.user._id;
      const id = req.params.id;
      const income = await this.findIncome(userID, id);

      const removeResult = await IncomeModel.deleteOne({
        owner: userID,
        _id: id,
      });
      if (removeResult.deletedCount == 0)
        throw createHttpError.InternalServerError("خطا در سرور");
      res.status(200).json({
        statsCode: 200,
        message: "درآمد حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async findIncome(userID, incomeID) {
    const income = await IncomeModel.findOne({ _id: incomeID, owner: userID });
    if (!income) throw createHttpError.NotFound("درآمد یافت نشد");
    return income;
  }
}

module.exports = {
  IncomeController: new IncomeController(),
};
