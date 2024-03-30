import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Word from "@/models/Word";
import Verb from "@/models/Verb";

// import-data, profile, words, verbs
// imports the default vocabulary into the user's account

export async function POST(req, res) {
  const { userId } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.wordsImported === false) {
      const defaultWords = await Word.find();
      user.customWords.push(...defaultWords);
      user.customWords.map((word) => (word.level = 1));
      const defaultVerbs = await Verb.find();
      user.customVerbs.push(...defaultVerbs);
      user.wordsImported = true;
      await user.save();
      const customWords = user.customWords;
      return NextResponse.json(
        {
          customWords,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Words already imported" },
        { status: 409 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error importing data",
      },
      { status: 500 }
    );
  }
}
