import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

// profile
// provides all necessary information for the user profile

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const registrationDate = user.createdAt;
    const customWords = user.customWords.length;
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
      {
        message: "Error retrieving user data",
      },
      { status: 500 }
    );
  }
}
