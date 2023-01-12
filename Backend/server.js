require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3500 || process.env.PORT;

app.use(cors());

//BUILT-IN MIDDLEWARES
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.listen(PORT, () => {
  console.log("Server started on Port 3500");
});
