import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        holdings: user.holdings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    console.log("=== Google Auth Started ===");
    console.log("Request body keys:", Object.keys(req.body));

    const { credential, accessToken } = req.body;
    let payload;

    if (credential) {
      console.log("Using credential (ID token) flow");
      if (!process.env.GOOGLE_CLIENT_ID) {
        console.error("ERROR: GOOGLE_CLIENT_ID is not set in .env");
        return res.status(500).json({ message: "Server misconfiguration: missing GOOGLE_CLIENT_ID" });
      }
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      console.log("ID token verified successfully");
    } else if (accessToken) {
      console.log("Using accessToken flow");
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google userinfo API error:", response.status, errorText);
        throw new Error(`Failed to fetch user info from Google: ${response.status}`);
      }
      payload = await response.json();
      console.log("Access token verified successfully");
    } else {
      console.error("ERROR: No credential or accessToken in request body");
      return res.status(400).json({ message: "No token provided" });
    }

    const { email, name, picture, sub: googleId } = payload;
    console.log("Google user info:", { email, name, googleId: googleId ? "present" : "missing" });

    if (!email || !name) {
      console.error("ERROR: Missing required fields from Google payload:", { email, name });
      return res.status(400).json({ message: "Incomplete Google profile (missing email or name)" });
    }

    let user = await User.findOne({ email });
    console.log("Existing user found:", !!user);

    if (!user) {
      console.log("Creating new user...");
      user = await User.create({
        email,
        name,
        googleId,
        avatar: picture,
      });
      console.log("New user created with ID:", user._id);
    }

    const token = generateToken(user._id);
    console.log("JWT token generated successfully");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        holdings: user.holdings,
      },
    });
    console.log("=== Google Auth Completed Successfully ===");
  } catch (error) {
    console.error("=== Google Auth FAILED ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
