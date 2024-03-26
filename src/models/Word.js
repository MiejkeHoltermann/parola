import mongoose, { Schema, models } from "mongoose";

const wordSchema = new Schema(
  {
    englishWord: { type: String, required: true },
    italianWord: { type: String, required: true },
  },
  { timestamps: true }
);

const Word = models.Word || mongoose.model("Word", wordSchema);

export default Word;
