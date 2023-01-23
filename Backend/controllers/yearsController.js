const asyncHandler = require("express-async-handler");
const pool = require("../config/db");

const getAllYears = asyncHandler(async (req, res) => {
  try {
    const allYears = await pool.query("SELECT * FROM years");
    return res.status(200).json(allYears.rows);
  } catch (error) {
    res.sendStatus(500);
  }
});

const createYear = asyncHandler(async (req, res) => {
  const { graduation_year } = req.body;

  if (Number.isNaN(graduation_year)) {
    return res.status(400).json({ message: "Input is Not a Valid Year " });
  }

  if (graduation_year.toString().length !== 4)
    return res.status(400).json({ message: "Invalid year format" });

  const newYear = await pool.query(
    "INSERT INTO years (graduation_year) VALUES ($1) RETURNING *",
    [graduation_year]
  );
  console.log("newYear", newYear);

  if (newYear) {
    return res.status(200).json(newYear.rows[0]);
  } else {
    return res.sendStatus(500);
  }
});

module.exports = { getAllYears, createYear };
