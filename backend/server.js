const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require(
  "./routes/notificationRoutes"
);
const userRoutes = require(
  "./routes/userRoutes"
);

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Home Route
app.get("/", (req, res) => {
  res.send(
    "TaskFlow API Running..."
  );
});

// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);

// Project Routes
app.use(
  "/api/projects",
  projectRoutes
);

// Task Routes
app.use(
  "/api/tasks",
  taskRoutes
);

// Team Routes
app.use(
  "/api/team",
  teamRoutes
);

// Notification Routes
app.use(
  "/api/notifications",
  notificationRoutes
);

// User Routes (Admin)
app.use(
  "/api/users",
  userRoutes
);

// Start Server
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running on ${PORT}`
  );
});