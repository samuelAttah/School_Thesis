const router = require("express").Router();
const yearsController = require("../../controllers/yearsController");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .get(yearsController.getAllYears)
  .post(verifyJWT, yearsController.createYear);

module.exports = router;
