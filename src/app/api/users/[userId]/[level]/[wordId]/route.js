import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { userId, level, wordId } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const word = user.customWords.find(
      (word) => word._id.toString() === wordId
    );
    console.log(word);
    if (!word) {
      return res.status(404).json({ message: "Word not found." });
    }
    word.level = level + 1;
    await user.save();
    return NextResponse.json(
      { message: "Word added to this level." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating this level." },
      { status: 500 }
    );
  }
}
