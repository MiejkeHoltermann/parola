import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import Word from "@/models/Word";
import Verb from "@/models/Verb";
import { NextResponse } from "next/server";

export async function POST(req, res) {
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
    user.wordsImported = true;
    await user.save();
    return NextResponse.json(
      { message: "Data imported for user." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error importing data for user." },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const registrationDate = user.createdAt;
    const customWords = user.customWords;
    const wordsLevel1 = user.customWords.filter(
      (word) => word.level == 1
    ).length;
    const wordsLevel2 = user.customWords.filter(
      (word) => word.level == 2
    ).length;
    const wordsLevel3 = user.customWords.filter(
      (word) => word.level == 3
    ).length;
    const wordsLevel4 = user.customWords.filter(
      (word) => word.level == 4
    ).length;
    const wordsLevel5 = user.customWords.filter(
      (word) => word.level == 5
    ).length;
    const favorites = user.customWords.filter(
      (word) => word.isFavorite === true
    ).length;
    const customVerbs = user.customVerbs;
    const verbFavorites = user.customVerbs.filter(
      (verb) => verb.isFavorite === true
    ).length;
    const wordsImported = user.wordsImported;
    return NextResponse.json(
      {
        registrationDate,
        customWords,
        wordsLevel1,
        wordsLevel2,
        wordsLevel3,
        wordsLevel4,
        wordsLevel5,
        favorites,
        customVerbs,
        verbFavorites,
        wordsImported,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Word.findByIdAndDelete(id);
  return NextResponse.json({ message: "Word deleted" }, { status: 200 });
}
