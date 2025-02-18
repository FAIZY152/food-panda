import express from "express";
import userRoute from "./routes/UserRoute";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { resturentRoute } from "./routes/ResturentRoutes";
import orderRoute from "./routes/orderRoute";
import menuRoute from "./routes/MenuRoute";
import connectDB from "./utils/DB";
import path from "path";
import mime from "mime-types";

connectDB();

const app = express(); // Create an express application
const PORT = process.env.PORT || 5200; // Define the port number

// Middleware for parsing JSON requests
app.use(bodyParser.json({ limit: "10mb" })); // Parse application/json use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOption));

const DIRNAME = path.resolve();
// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Test auth middleware
// app.get("/middleware", IsAuthenticated, (req, res) => {
//   res.status(200).json({ message: "You are authenticated!", userId: req.id });
//   console.log(req.id);
// });

// Routes

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/resturent", resturentRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

const FRONTEND_PATH = path.join(__dirname, "../../front/dist");
// app.use(express.static(path.join(DIRNAME, "front", "dist")));

// Serve index.html for all unknown routes
app.get("*", (_, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
