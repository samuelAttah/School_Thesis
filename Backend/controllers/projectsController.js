const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const allProjects = await pool.query("SELECT * FROM projects");
    return res.status(200).json(allProjects.rows);
  } catch (error) {
    res.sendStatus(500);
  }
});

const createProject = asyncHandler(async (req, res) => {
  const { title, abstract, file_url, graduation_year_id } = req.body;

  const uploader_id = req.userId;

  if (!uploader_id) {
    return res.sendStatus(404);
  }

  if (!title || !abstract || !file_url || !graduation_year_id) {
    return res.status(400).json({ message: "Missing Required Parameters" });
  }

  const newProject = await pool.query(
    "INSERT INTO projects (title, abstract, file_url, graduation_year_id, uploader_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, abstract, file_url, graduation_year_id, uploader_id]
  );

  if (newProject) {
    return res.status(200).json(newProject.rows[0]);
  } else {
    return res
      .status(500)
      .json({ message: "Error Occured while creating new project" });
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const { title, abstract, file_url, graduation_year_id } = req.body;
  const { id } = req.params;

  const uploader_id = req.userId;

  if (!uploader_id) {
    return res.sendStatus(404);
  }

  if (!id || !title || !abstract || !file_url || !graduation_year_id) {
    return res.status(400).json({ message: "Missing Required Parameters" });
  }

  const editedProject = await pool.query(
    "UPDATE projects SET title = $1, abstract = $2, file_url = $3, graduation_year_id = $4, uploader_id = $5 WHERE id = $6",
    [title, abstract, file_url, graduation_year_id, uploader_id, id]
  );

  if (editedProject) {
    return res.status(200).json({ message: "Successfully Updated" });
  } else {
    return res.status(500).json({ message: "Failed To Update Project" });
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing Id Parameter" });
  }

  const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);

  //   console.log("result", result);

  if (result.rowCount === 0) {
    res.status(400).json({ message: "Invalid Id Parameter" });
  }

  return res.status(200).json({ message: "Deleted Successfully" });
});

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};
