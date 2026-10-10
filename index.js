const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware to parse incoming request bodies (form data)
app.use(express.urlencoded({ extended: false }));

// Middleware 1: Log requests with timestamps to log.txt
app.use((req, res, next) => {
  req.myUserName = "Varun Patil";
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

// Middleware 2: Console log incoming user request
app.use((req, res, next) => {
  console.log("Request received for user:", req.myUserName);
  next();
});

// Route 1: GET /api/users - Return all users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Route 2: POST /api/users - Add new user and save to MOCK_DATA.json
app.post("/api/users", (req, res) => {
  const body = req.body;
  if (!body || !body.first_name || !body.email) {
    return res.status(400).json({ msg: "First name and email are required!" });
  }

  const newUser = { ...body, id: users.length + 1 };
  users.push(newUser);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: newUser.id });
  });
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));