import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

const generateUsername = async (name, email) => {
  const emailBase = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const nameBase = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const tempUsername = `${nameBase.substring(0, 10)}_${emailBase.substring(0, 10)}`;

  let isUnique = false;
  let counter = 0;
  let finalUsername = tempUsername;

  while (!isUnique) {
    const existingUser = await User.findOne({ username: finalUsername });
    if (!existingUser) {
      isUnique = true;
    } else {
      counter++;
      finalUsername = `${tempUsername}${counter}`;
    }
  }

  return finalUsername;
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const username = await generateUsername(name, email);
    const user = await User.create({ name, email, password, username });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        watchlist: user.watchlist,
        preferences: user.preferences,
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
        username: user.username,
        holdings: user.holdings,
        watchlist: user.watchlist,
        preferences: user.preferences,
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
        console.error("ERROR: GOOGLE_CLIENT_ID is not set in environment");
        return res.status(500).json({ message: "Server misconfiguration: missing GOOGLE_CLIENT_ID" });
      }
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
        console.log("ID token verified successfully");
      } catch (verifyError) {
        console.error("ID Token verification failed:", verifyError.message);
        return res.status(401).json({ message: "Invalid Google ID token", error: verifyError.message });
      }
    } else if (accessToken) {
      console.log("Using accessToken flow");
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Google userinfo API error:", response.status, errorText);
          return res.status(response.status).json({
            message: `Failed to fetch user info from Google: ${response.status}`,
            details: errorText
          });
        }

        payload = await response.json();
        console.log("Access token verified successfully");
      } catch (fetchError) {
        console.error("Fetch error during userinfo request:", fetchError.message);
        return res.status(500).json({ message: "Failed to connect to Google API", error: fetchError.message });
      }
    } else {
      console.error("ERROR: No credential or accessToken in request body");
      return res.status(400).json({ message: "No token provided" });
    }

    if (!payload) {
      console.error("ERROR: No payload extracted from Google token");
      return res.status(400).json({ message: "Failed to extract user info from Google" });
    }

    const { email, name, picture, sub: googleId } = payload;
    console.log("Google user info:", { email, name, googleId: googleId ? "present" : "missing" });

    if (!email || !name) {
      console.error("ERROR: Missing required fields from Google payload:", { email, name, payloadKeys: Object.keys(payload) });
      return res.status(400).json({ message: "Incomplete Google profile (missing email or name)" });
    }

    let user = await User.findOne({ email });
    console.log("Existing user found:", !!user);

    if (!user) {
      console.log("Creating new user...");
      try {
        const username = await generateUsername(name, email);
        user = await User.create({
          email,
          name,
          username,
          googleId,
          avatar: picture,
        });
        console.log("New user created with ID:", user._id);
      } catch (createError) {
        console.error("Error creating new Google user:", createError.message);
        return res.status(500).json({ message: "Failed to create user account", error: createError.message });
      }
    } else {
      // Update googleId and avatar if not present
      let needsUpdate = false;
      if (!user.googleId) { user.googleId = googleId; needsUpdate = true; }
      if (!user.avatar && picture) { user.avatar = picture; needsUpdate = true; }
      if (needsUpdate) {
        await user.save();
        console.log("Updated existing user with Google info");
      }
    }

    const token = generateToken(user._id);
    console.log("JWT token generated successfully");

    console.log("=== Google Auth Completed Successfully ===");
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        holdings: user.holdings,
        watchlist: user.watchlist,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("=== Google Auth CRITICAL FAILURE ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: "Internal server error during Google authentication", error: error.message });
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

export const updateWatchlist = async (req, res) => {
  try {
    const { watchlist } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { watchlist },
      { new: true }
    ).select("-password");

    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    // Use dot notation to only update the provided fields
    const updateQuery = {};
    if (typeof preferences.autoRefresh === 'boolean') updateQuery["preferences.autoRefresh"] = preferences.autoRefresh;
    if (typeof preferences.notifications === 'boolean') updateQuery["preferences.notifications"] = preferences.notifications;
    if (preferences.currency) updateQuery["preferences.currency"] = preferences.currency;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateQuery },
      { new: true }
    ).select("-password");

    res.json({ preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
