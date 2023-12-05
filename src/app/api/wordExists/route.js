import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { userId, germanWord, italianWord } = await request.json();

  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const word1 = await user.customWords.find(
      (word) => word.germanWord === germanWord
    );
    const word2 = await user.customWords.find(
      (word) => word.italianWord === italianWord
    );

    return NextResponse.json({ word1, word2 });
  } catch (error) {
    console.log(error);
  }
}
