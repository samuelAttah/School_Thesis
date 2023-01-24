const bcrypt = require("bcrypt");
const pool = require("../config/db");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await pool.query(
        "SELECT * FROM users WHERE user_name = $1",
        [decoded.username]
      );

      if (foundUser.rowCount !== 1)
        return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { username: decoded.username, userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      //clear previous cookie and set another
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      const newRefreshToken = jwt.sign(
        { username: foundUser.rows[0].user_name, userId: foundUser.rows[0].id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //Create Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); //remember to add secure: true in production
      res.json({ accessToken: accessToken });
    }
  );
});

module.exports = { handleRefreshToken };
