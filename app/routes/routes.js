const { IndexRouter } = require("./api");
const { ExpenseRouter } = require("./api/expense");
const { IncomeRouter } = require("./api/income");
const { AuthRouter } = require("./user/auth");
const { UserRouter } = require("./user/user");

const router = require("express").Router();

router.use("/", IndexRouter);
router.use("/user", UserRouter);
router.use("/user/auth", AuthRouter);
router.use("/income", IncomeRouter);
router.use("/expense", ExpenseRouter);

module.exports = {
  AllRoutes: router,
};
