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

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
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
