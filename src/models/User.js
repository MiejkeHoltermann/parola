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
    customVerbs: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        presente: {
          presente01: { type: String, required: true },
          presente02: { type: String, required: true },
          presente03: { type: String, required: true },
          presente04: { type: String, required: true },
          presente05: { type: String, required: true },
          presente06: { type: String, required: true },
        },
        imperfetto: {
          imperfetto01: { type: String, required: true },
          imperfetto02: { type: String, required: true },
          imperfetto03: { type: String, required: true },
          imperfetto04: { type: String, required: true },
          imperfetto05: { type: String, required: true },
          imperfetto06: { type: String, required: true },
        },
      },
    ],
    activeVerbs: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        presente: {
          presente01: { type: String, required: true },
          presente02: { type: String, required: true },
          presente03: { type: String, required: true },
          presente04: { type: String, required: true },
          presente05: { type: String, required: true },
          presente06: { type: String, required: true },
        },
        imperfetto: {
          imperfetto01: { type: String, required: true },
          imperfetto02: { type: String, required: true },
          imperfetto03: { type: String, required: true },
          imperfetto04: { type: String, required: true },
          imperfetto05: { type: String, required: true },
          imperfetto06: { type: String, required: true },
        },
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
