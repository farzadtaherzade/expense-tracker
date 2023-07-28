const {
  ExpenseController,
} = require("../../http/controllers/api/expense.controller");
const {
  VerifyAccessToken,
} = require("../../http/middlewares/verify_access_token");

const router = require("express").Router();

router.get("/total", VerifyAccessToken, ExpenseController.getAllExpenses);
router.post(
  "/add-expense",
  VerifyAccessToken,
  ExpenseController.createNewExpenses
);
router.delete(
  "/remove-expense/:id",
  VerifyAccessToken,
  ExpenseController.removeExpense
);
router.get("/get-expense", VerifyAccessToken, ExpenseController.getExpense);

module.exports = {
  ExpenseRouter: router,
};
