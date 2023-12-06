import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    customWords: [
      {
        _id: { type: String, required: true },
        germanWord: { type: String, required: true },
        italianWord: { type: String, required: true },
        level: { type: Number },
      },
    ],
    activeWords: [
      {
        _id: { type: String, required: true },
        germanWord: { type: String, required: true },
        italianWord: { type: String, required: true },
        level: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
