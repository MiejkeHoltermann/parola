import mongoose, { Schema, models } from "mongoose";

const verbSchema = new Schema(
  {
    name: { type: String, required: true },
    presente: {
      presente01: { type: String, required: true },
      presente02: { type: String, required: true },
      presente03: { type: String, required: true },
      presente04: { type: String, required: true },
      presente05: { type: String, required: true },
      presente06: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Verb = models.Verb || mongoose.model("Verb", verbSchema);

export default Verb;
