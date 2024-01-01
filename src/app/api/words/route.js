import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Word from "@/models/Word";
import User from "@/models/User";
import { uid } from "uid/secure";

export async function POST(req, res) {
  const { userId, germanWord, italianWord } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const _id = uid();
    user.customWords.unshift({
      _id,
      germanWord,
      italianWord,
      level: 1,
      isFavorite: false,
      newWord: true,
    });
    const wordId = _id;
    await user.save();
    const newWords = user.customWords;
    return NextResponse.json({ wordId, newWords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating WordsLevel1." },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongoDB();
  const words = await Word.find();
  return NextResponse.json({ words });
}
