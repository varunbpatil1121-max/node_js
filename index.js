const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

// ==========================================
// BUILT-IN MIDDLEWARE
// ==========================================
// This built-in guard takes form data sent by a user and turns it into a JavaScript object in req.body
app.use(express.urlencoded({ extended: false }));

// ==========================================
// CUSTOM MIDDLEWARE 1: THE LOGBOOK GUARD
// ==========================================
// Every time any visitor knocks on our door, this guard writes down the visit in "log.txt"
app.use((req, res, next) => {
  const logMessage = `\n${Date.now()}: ${req.ip} made a ${req.method} request to ${req.path}`;

  fs.appendFile("log.txt", logMessage, (err) => {
    // Once writing is done, open the door to the next guard
    next();
  });
});

// ==========================================
// CUSTOM MIDDLEWARE 2: THE NAMETAG GUARD
// ==========================================
// This guard attaches extra information to the visitor's request (req)
app.use((req, res, next) => {
  console.log("Hello from Middleware 2!");

  // Stick a custom property onto the request
  req.myUserName = "Piyush Garg";

  // Let the visitor move forward
  next();
});

// ==========================================
// CUSTOM MIDDLEWARE 3: THE CHECKPOINT GUARD
// ==========================================
// This guard can see what previous guards attached
app.use((req, res, next) => {
  console.log("Middleware 3 sees user:", req.myUserName);

  // If you want to stop a bad visitor, you can uncomment the line below:
  // return res.json({ message: "Guard stopped you here!" });

  next();
});

// ==========================================
// ROUTES (THE ROOMS INSIDE)
// ==========================================
// Route 1: Get all users
app.get("/users", (req, res) => {
  console.log("Inside /users route! User attached is:", req.myUserName);

  return res.json({
    status: "Success",
    message: "Welcome to the playroom!",
    currentUser: req.myUserName,
  });
});

// Route 2: Specific user route
app.get("/api/users", (req, res) => {
  return res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

// ==========================================
// START THE SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});