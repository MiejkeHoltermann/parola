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
    if (editedGermanWord && editedItalianWord) {
      const activeWord = user.customWords.id(wordId);
      activeWord.germanWord = editedGermanWord;
      activeWord.italianWord = editedItalianWord;
      await user.save();
      return NextResponse.json(
        { message: "Word is now favorite." },
        { status: 200 }
      );
    } else {
      const wordIndex = user.customWords.findIndex(
        (word) => word._id.toString() === wordId
      );
      if (wordIndex !== -1) {
        user.customWords[wordIndex].isFavorite =
          !user.customWords[wordIndex].isFavorite;
      } else {
        const verbIndex = user.customVerbs.findIndex(
          (verb) => verb._id.toString() === wordId
        );
        if (verbIndex !== -1) {
          user.customVerbs[verbIndex].isFavorite =
            !user.customVerbs[verbIndex].isFavorite;
        } else {
          return NextResponse.status(404).json({ message: "Word not found." });
        }
      }
      await user.save();
      return NextResponse.json(
        { message: "Word is now favorite." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error setting word as favorite." },
      { status: 500 }
    );
  }
}

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

export async function POST(request) {
  const { userId, germanWord, italianWord, name } = await request.json();

  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (germanWord && italianWord) {
      const word1 = await user.customWords.find(
        (word) => word.germanWord === germanWord
      );
      const word2 = await user.customWords.find(
        (word) => word.italianWord === italianWord
      );
      return NextResponse.json({ word1, word2 });
    } else {
      const verb = await user.customVerbs.find((verb) => verb.name === name);
    }
    return NextResponse.json({ verb });
  } catch (error) {
    console.log(error);
  }
}
