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
    wordsLevel1: [{ type: Schema.Types.ObjectId, ref: "Word" }],
    wordsLevel2: [{ type: Schema.Types.ObjectId, ref: "Word" }],
    wordsLevel3: [{ type: Schema.Types.ObjectId, ref: "Word" }],
    wordsLevel4: [{ type: Schema.Types.ObjectId, ref: "Word" }],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
