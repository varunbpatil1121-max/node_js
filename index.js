const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Sample mock data for users
const users = [
  { id: 1, first_name: "Varun", last_name: "Patil", job_title: "Developer" },
  { id: 2, first_name: "Govindraj", last_name: "pawar", job_title: "Designer" },
];

// Built-in middleware to handle form submissions
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.method} ${req.path}`,
    (err) => {
      next();
    }
  );
});

// ========================================================
// ROUTE: Getting users and demonstrating HTTP Headers
// ========================================================
app.get("/api/users", (req, res) => {
  // Step 1: Read all headers incoming from the client (Postman/Browser)
  console.log("--- Incoming Request Headers ---");
  console.log(req.headers);

  // Step 2: Set a Custom Response Header with the name "Varun Patil"
  // Best practice: Always prefix custom headers with 'X-'
  res.setHeader("X-MyName", "Varun Patil");

  // Step 3: Send the JSON response back to the client
  return res.json(users);
});

// ========================================================
// ROUTE: Single user lookup
// ========================================================
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Set the custom author header here as well
  res.setHeader("X-MyName", "Varun Patil");
  return res.json(user);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});