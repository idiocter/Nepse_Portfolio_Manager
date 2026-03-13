import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";

import portfolioRoutes from "./routes/portfolio.js";
import marketRoutes from "./routes/market.js";
import { initJobs } from "./jobs/priceJob.js";

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://nepse-portfolio-manager-self.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());


// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI,
  )
  .then(() => {
    console.log("MongoDB Connected");
    initJobs(); // Correct location for initializing jobs
  })
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market", marketRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
