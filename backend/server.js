const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const {
  initSocket,
} = require("./socket/socket");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const activityRoutes = require("./routes/activityRoutes");
const fileRoutes = require("./routes/fileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const timeLogRoutes = require("./routes/timeLogRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

initSocket(io);
const adminRoutes = require("./routes/adminRoutes");

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Health Check
app.get("/", (req, res) => {
  res.send("TaskFlow API Running...");
});

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/team", teamRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use("/api/users", userRoutes);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/activity",
  activityRoutes
);

app.use("/api/files", fileRoutes);

app.use("/api/search", searchRoutes);

// Time Tracking
app.use(
  "/api/time",
  timeLogRoutes
);

// Reports
app.use(
  "/api/reports",
  reportRoutes
);

// Settings
app.use(
  "/api/settings",
  settingsRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message:
      err.message ||
      "Server Error",
  });
});

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server Running on Port ${PORT}`
  );
});