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
        englishWord: { type: String, required: true },
        italianWord: { type: String, required: true },
        level: { type: Number, required: true, default: 1 },
        isFavorite: { type: Boolean, required: true, default: false },
      },
    ],
    customVerbs: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        isFavorite: { type: Boolean, required: true, default: false },
        presente: {
          presente01: { type: String, required: true },
          presente02: { type: String, required: true },
          presente03: { type: String, required: true },
          presente04: { type: String, required: true },
          presente05: { type: String, required: true },
          presente06: { type: String, required: true },
        },
      },
    ],
    wordsImported: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
