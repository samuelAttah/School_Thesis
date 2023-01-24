const router = require("express").Router();
const registerController = require("../../controllers/authController");

router.route("/").post(registerController.handleLogin);

module.exports = router;
