import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { userId, wordId } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wordIndex = user.customWords.findIndex(
      (word) => word._id.toString() === wordId
    );
    if (wordIndex === -1) {
      return res.status(404).json({ message: "Word not found." });
    }
    user.customWords.splice(wordIndex, 1);
    await user.save();
    const newWords = user.customWords;
    return NextResponse.json({ newWords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting word." },
      { status: 500 }
    );
  }
}
