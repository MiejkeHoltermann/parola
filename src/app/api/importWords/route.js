import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Word from "@/models/Word";
import Verb from "@/models/Verb";

export async function POST(req) {
  const { userId } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const defaultWords = await Word.find();
    user.customWords.push(...defaultWords);
    user.customWords.map((word) => (word.level = 1));
    const defaultVerbs = await Verb.find();
    user.customVerbs.push(...defaultVerbs);
    await user.save();
    const customWords = user.customWords;
    console.log(customWords);
    return NextResponse.json({ customWords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error importing data for user." },
      { status: 500 }
    );
  }
}
