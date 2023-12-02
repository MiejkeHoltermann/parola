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

    const wordsLevel = `wordsLevel${level}`;
    const nextLevel = level + 1;
    const wordsLevelUp = `wordsLevel${nextLevel}`;

    if (!user[wordsLevelUp].includes(wordId)) {
      user[wordsLevelUp].push(wordId);
      const index = user[wordsLevel].indexOf(wordId);
      if (index !== -1) {
        user[wordsLevel].splice(index, 1);
      }

      await user.save();
      return NextResponse.json(
        { message: "Word added to WordsLevel1." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Word already in WordsLevel1." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating WordsLevel1." },
      { status: 500 }
    );
  }
}
