const express = require("express");
const router = express.Router();
const projectsController = require("../../controllers/projectsController");

//PROJECTS ROUTE
router
  .route("/")
  .get(projectsController.getAllProjects)
  .post(projectsController.createProject);

router
  .route("/:id")
  .put(projectsController.updateProject)
  .delete(projectsController.deleteProject);

module.exports = router;
