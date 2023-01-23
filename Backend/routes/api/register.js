const router = require("express").Router();
const registerController =
  require("../../controllers/authController").handleNewUser;

router.route("/").post(registerController);

module.exports = router;
