require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3500 || process.env.PORT;
const path = require("path");

app.use(cors());

//BUILT-IN MIDDLEWARES
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

//built in middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/projects", require("./routes/api/projects"));
app.use("/years", require("./routes/api/years"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    //we set the content-type response header to text
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log("Server started on Port 3500");
});
