const router = require("express").Router();
const yearsController = require("../../controllers/yearsController");

router
  .route("/")
  .get(yearsController.getAllYears)
  .post(yearsController.createYear);

module.exports = router;
