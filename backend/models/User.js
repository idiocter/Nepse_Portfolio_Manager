import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: String,
    holdings: [
      {
        symbol: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        avgPrice: { type: Number, required: true, min: 0 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    watchlist: [{ type: String }],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
