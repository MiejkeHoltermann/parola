import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const words = await Word.find();
  return NextResponse.json({ words });
}

export async function PUT(request) {
  const { userId, wordId, editedGermanWord, editedItalianWord } =
    await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.status(404).json({ message: "User not found" });
    }
    const activeWord = user.customWords.id(wordId);
    activeWord.germanWord = editedGermanWord;
    activeWord.italianWord = editedItalianWord;
    await user.save();
    return NextResponse.json(
      { message: "Word is now favorite." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error setting word as favorite." },
      { status: 500 }
    );
  }
}
