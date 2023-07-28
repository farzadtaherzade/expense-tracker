const {
  IncomeController,
} = require("../../http/controllers/api/income.controller");
const {
  VerifyAccessToken,
} = require("../../http/middlewares/verify_access_token");
const router = require("express").Router();

router.get("/total", VerifyAccessToken, IncomeController.getAllIncome);
router.post("/add-income", VerifyAccessToken, IncomeController.createNewIncome);
router.delete(
  "/remove-income/:id",
  VerifyAccessToken,
  IncomeController.removeIncome
);
router.get("/get-income", VerifyAccessToken, IncomeController.getIncomes);

module.exports = {
  IncomeRouter: router,
};
