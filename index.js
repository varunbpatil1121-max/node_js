const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Sample database array with Varun Patil as the initial user
const users = [
  {
    id: 1,
    first_name: "Varun",
    last_name: "Patil",
    email: "varun.patil@example.com",
    gender: "Male",
    job_title: "Full Stack Developer",
  },
];

// Middleware to parse URL-encoded form data from Postman
app.use(express.urlencoded({ extended: false }));

// Custom header middleware
app.use((req, res, next) => {
  res.setHeader("X-Author", "Varun Patil");
  next();
});

// ==========================================================
// 1. GET ALL USERS -> 200 OK
// ==========================================================
app.get("/api/users", (req, res) => {
  // 200 means: Everything was successful and data is returned
  return res.status(200).json(users);
});

// ==========================================================
// 2. GET USER BY ID -> 200 OK or 404 NOT FOUND
// ==========================================================
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  // 404 means: The client searched for an ID that does not exist
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // 200 means: User was found
  return res.status(200).json(user);
});

// ==========================================================
// 3. CREATE NEW USER -> 201 CREATED or 400 BAD REQUEST
// ==========================================================
app.post("/api/users", (req, res) => {
  const body = req.body;

  // Validation: Check if all mandatory fields were sent by the client
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    // 400 means: Client made a mistake (missing form data)
    return res.status(400).json({ error: "All fields are required!" });
  }

  const newUser = {
    id: users.length + 1,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  };

  users.push(newUser);

  // 201 means: A brand-new resource was created successfully
  return res.status(201).json({ status: "Success", user: newUser });
});

// ==========================================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});