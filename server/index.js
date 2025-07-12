// index.js
import "./instrument.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import connectDB from "./utils/db.js";
// import userRoute from "";
import router from "./routes/user.route.js";

dotenv.config({});

const app = express();

// Set up express middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", router);

// ✅ Setup new Sentry middleware (replaces requestHandler)
Sentry.setupExpressErrorHandler(app);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I'm coming from the backend",
    success: true,
  });
});

app.get("/debug-sentry", (req, res) => {
  throw new Error("Sentry test error!");
});

// ✅ Error handler (new version for Sentry v8)
// Sentry.setupExpressErrorHandler(app);

// Optional fallback
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    errorId: res.sentry || null,
    message: "Something went wrong.",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
