const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const usersRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./helpers/responseHelper");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const { clientSiteURL } = require("./secret");
const app = express();

// Set limit and time for maximum request
const setRateLimit = () =>
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    message: "Too many request...",
  });

const allowCors = (req, res, next) => {
  const origin = req.headers.origin;
  const configuredOrigins = (clientSiteURL || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const localOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ];

  let isAllowed = !origin || configuredOrigins.includes(origin);

  try {
    const hostname = origin ? new URL(origin).hostname : "";
    isAllowed =
      isAllowed ||
      localOrigins.includes(origin) ||
      hostname.endsWith(".vercel.app");
  } catch (error) {
    isAllowed = false;
  }

  if (origin && isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};

// For using middlewares globally
app.use(allowCors);
app.use(xss());
app.use(setRateLimit());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

app.get("/api/health", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    success: true,
    message: "API is healthy",
    database: dbStates[mongoose.connection.readyState] || "unknown",
  });
});

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(
      createError(
        503,
        "Database connection is not ready. Check MONGODB_URL and Atlas Network Access.",
      ),
    );
  }

  next();
});

app.use("/api/users", usersRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// Client site error...
// Use to create an error...
// And passing through the `next()` method...
// Into the next middleware `server site`...
// To return the response...
// In short - Creating the error...
app.use((req, res, next) => {
  next(createError(404, "Route Not Found!"));
});

// Server site or global error...
// When we use `throw error` or `throw(createError())`...
// or `next(error)` or `next(createError())`...
// The system will come into this middleware...
// From anywhere to return the final response...
// In short - Showing the error...
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || err.statusCode,
    message: err.message,
  });
});

module.exports = app;
