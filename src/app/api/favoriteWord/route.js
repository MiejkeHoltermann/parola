import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { userId, wordId } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.status(404).json({ message: "User not found" });
    }

    const wordIndex = user.customWords.findIndex(
      (word) => word._id.toString() === wordId
    );
    if (wordIndex === -1) {
      return NextResponse.status(404).json({ message: "Word not found." });
    }
    user.customWords[wordIndex].isFavorite =
      !user.customWords[wordIndex].isFavorite;
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
