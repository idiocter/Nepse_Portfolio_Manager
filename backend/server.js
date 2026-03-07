import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cron from "node-cron";

import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import marketRoutes from "./routes/market.js";
import { updateLivePrices } from "./services/priceService.js";

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());


// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nepse-portfolio",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market", marketRoutes);

// Schedule price updates (11 AM - 3 PM, every 10 seconds)
// Nepal Time: UTC+5:45 -> 5:15 AM - 9:15 AM UTC
cron.schedule("*/10 * 5-9 * * 0-4", () => {
  const nepalHour = new Date().getUTCHours() + 5;
  const nepalMinute = new Date().getUTCMinutes() + 45;
  const adjustedHour = nepalMinute >= 60 ? nepalHour + 1 : nepalHour;
  const finalHour = adjustedHour >= 24 ? adjustedHour - 24 : adjustedHour;

  if (finalHour >= 11 && finalHour < 15) {
    console.log("Updating live prices...");
    updateLivePrices();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
