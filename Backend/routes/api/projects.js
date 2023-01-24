const express = require("express");
const router = express.Router();
const projectsController = require("../../controllers/projectsController");
const verifyJWT = require("../../middleware/verifyJWT");

//PROJECTS ROUTE
router
  .route("/")
  .get(projectsController.getAllProjects)
  .post(verifyJWT, projectsController.createProject);

router
  .route("/:id")
  .put(verifyJWT, projectsController.updateProject)
  .delete(verifyJWT, projectsController.deleteProject);

module.exports = router;
