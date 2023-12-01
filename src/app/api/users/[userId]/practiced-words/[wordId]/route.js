import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { userId, wordId } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.practicedWords.includes(wordId)) {
      user.practicedWords.push(wordId);

      await user.save();
      return NextResponse.json(
        { message: "Word added to practicedWords." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Word already in practicedWords." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating practicedWords." },
      { status: 500 }
    );
  }
}
