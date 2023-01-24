const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer"))
    return res.status(401).send("Unauthorized");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" }); //because this implies user's token is invalid
    //here we modify the request and push it down to verifyroles middleware
    req.user = decoded.username;
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyJWT;
