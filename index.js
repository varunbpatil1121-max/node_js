const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom header middleware
app.use((req, res, next) => {
  res.setHeader("X-Author", "Varun Patil");
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/user_database")
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Schema & Model definition
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

// Seed default users if collection is empty
async function seedDefaultUsers() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([
        {
          firstName: "Varun",
          lastName: "Patil",
          email: "varun.patil@example.com",
          jobTitle: "Full Stack Developer",
          gender: "Male",
        },
        {
          firstName: "Govindraj",
          lastName: "Pawar",
          email: "govindraj.pawar@example.com",
          jobTitle: "Software Engineer",
          gender: "Male",
        },
      ]);
      console.log("Default users inserted!");
    }
  } catch (error) {
    console.error("Seeding Error:", error.message);
  }
}

seedDefaultUsers();

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET single user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Invalid User ID format" });
  }
});

// POST a new user
app.post("/api/users", async (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const result = await User.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      gender: body.gender,
      jobTitle: body.job_title,
    });

    return res.status(201).json({ status: "Success", id: result._id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});