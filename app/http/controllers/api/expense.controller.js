const createHttpError = require("http-errors");
const { ExpenseModel } = require("../../../models/expense");
const Controller = require("../controller");
const { expenseSchema } = require("../../validators/api/expense.schema");
const income = require("../../../models/income");

class ExpenseController extends Controller {
  async getAllExpenses(req, res, next) {
    try {
      const userID = req.user._id;
      const expenses = await ExpenseModel.find({ owner: userID });
      let expenseTotal = 0;
      expenses.forEach((expense) => {
        expenseTotal += expense.amount;
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          expenses,
          expenseTotal,
          length: expenses.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getExpense(req, res, next) {
    try {
      const userID = req.user._id;
      const { id } = req.params;
      const expenses = await this.findExpense(userID, id);
      return res.status(200).json({
        statusCode: 200,
        length: expenses.length,
        data: {
          expenses,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async createNewExpenses(req, res, next) {
    try {
      await expenseSchema.validateAsync();
      const userID = req.user._id;
      const { title, description, amount } = req.body;
      const result = await ExpenseModel.create({
        title,
        amount,
        owner: userID,
        type: "expense",
        description,
      });
      if (!result) throw createHttpError.BadRequest();
      res.status(201).json({
        statusCode: 201,
        message: "هزینه با موفقیت ایجاد شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async removeExpense(req, res, next) {
    try {
      const userID = req.user._id;
      const id = req.params.id;
      const expense = await this.findExpense(userID, id);

      const removeResult = await ExpenseModel.deleteOne({
        owner: userID,
        _id: id,
      });
      if (removeResult.deletedCount == 0)
        throw createHttpError.InternalServerError("خطا در سرور");
      res.status(200).json({
        statsCode: 200,
        message: "هزینه حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async findExpense(userID, expenseID) {
    const expense = await ExpenseModel.findOne({
      _id: expenseID,
      owner: userID,
    });
    if (!expense) throw createHttpError.NotFound("هزینه یافت نشد");
    return expense;
  }
}

module.exports = {
  ExpenseController: new ExpenseController(),
};
