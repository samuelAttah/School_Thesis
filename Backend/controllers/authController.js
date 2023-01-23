const bcrypt = require("bcrypt");
const pool = require("../config/db");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const handleLogin = asyncHandler(async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const foundUser = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (foundUser.rowCount === 0) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  //evaluate password using bcrypt if email was found
  const match = await bcrypt.compare(pwd, foundUser.rows[0].pwd);

  if (match) {
    //THIS IS WHERE WE SEND A JWT FOR PROTECTED ROUTES IN OUR API
    const accessToken = jwt.sign(
      { username: foundUser.rows[0].user_name, userId: foundUser.rows[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.rows[0].user_name, userId: foundUser.rows[0].id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // remember to add secure true in production

    return res.json({ accessToken: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid Password" });
  }
});

const handleNewUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!(username && password && email)) {
    return res
      .status(400)
      .json({ message: "Username, Email and Password are required" });
  }

  //CHECK FOR DUPLICATES
  const userNameDuplicate = await pool.query(
    "SELECT * FROM users WHERE user_name = $1",
    [username]
  );

  if (userNameDuplicate.rowCount !== 0) {
    return res.status(400).json({ message: "UserName already exists" });
  }

  const emailDuplicate = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (emailDuplicate.rowCount !== 0) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    //encrypt password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (user_name, email, pwd) VALUES ($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );
    // console.log(result);
    res.status(201).json({ success: `New User ${username} Created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { handleLogin, handleNewUser };
