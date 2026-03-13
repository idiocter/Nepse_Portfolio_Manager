import express from "express";
import {
  register,
  login,
  googleAuth,
  getMe,
  updateWatchlist,
  updatePreferences
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.put("/watchlist", protect, updateWatchlist);
router.put("/preferences", protect, updatePreferences);

export default router;
