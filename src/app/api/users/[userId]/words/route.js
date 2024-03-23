import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { uid } from "uid/secure";
import User from "@/models/User";

// words
// retrieves all words from the user's account

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const customWords = user.customWords;
    return NextResponse.json({ customWords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving words" },
      { status: 500 }
    );
  }
}

// WordForm
// checks whether a word already exists in the database
// if not a new word is created

export async function POST(request) {
  const { userId, germanWord, italianWord } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // does the German word already exist?
    const germanWordExists = await user.customWords.find(
      (word) => word.germanWord === germanWord
    );
    // does the Italian word already exist?
    const italianWordExists = await user.customWords.find(
      (word) => word.italianWord === italianWord
    );
    // do they belong together?
    if (
      germanWordExists &&
      italianWordExists &&
      germanWordExists._id === italianWordExists._id
    ) {
      return NextResponse.json(
        { message: "Word already exists" },
        { status: 409 }
      );
    }
    // if the word doesn't exist yet it is created
    else {
      const newWord = {
        _id: uid(),
        germanWord,
        italianWord,
        level: 1,
        isFavorite: false,
      };
      user.customWords.unshift(newWord);
      await user.save();
      const customWords = user.customWords;
      return NextResponse.json(
        {
          customWords,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// WordCard, wordpractice, FaveButton
/* depending on the parameters it receives the function either
updates the German and Italian word, updates the word's level or toggles the favorite state */

export async function PUT(request) {
  const { userId, wordId, newGermanWord, newItalianWord, level } =
    await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // if the parameters newGermanWord and newItalianWord are passed on, the function is used to edit the existing word
    if (newGermanWord && newItalianWord) {
      const updatedWord = user.customWords.id(wordId);
      updatedWord.germanWord = newGermanWord;
      updatedWord.italianWord = newItalianWord;
      await user.save();
      return NextResponse.json(
        {
          message: "Word updated successfully",
        },
        { status: 200 }
      );
    }
    // if the parameter level is passed on, the word's level is updated
    else if (level) {
      const word = user.customWords.find(
        (word) => word._id.toString() === wordId
      );
      if (word) {
        if (word.level !== 5) {
          word.level += 1;
        }
        await user.save();
        return NextResponse.json(
          { message: "Level updated successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Word not found" },
          { status: 404 }
        );
      }
    }
    // if none of these parameters are passed on, the function toggles the word's favorite state
    else {
      const currentWord = user.customWords.find(
        (word) => word._id.toString() === wordId
      );
      if (currentWord) {
        currentWord.isFavorite = !currentWord.isFavorite;
      } else {
        return NextResponse.json(
          {
            message: "Word not found",
          },
          { status: 404 }
        );
      }
      await user.save();
      const newCustomWords = user.customWords;
      return NextResponse.json({ newCustomWords }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error updating favorite state",
      },
      { status: 500 }
    );
  }
}

// WordCard
// removes a word from the database

export async function DELETE(request) {
  const { userId, wordId } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const wordIndex = user.customWords.findIndex(
      (word) => word._id.toString() === wordId
    );
    if (wordIndex !== -1) {
      user.customWords.splice(wordIndex, 1);
      await user.save();
      const newCustomWords = user.customWords;
      return NextResponse.json({ newCustomWords }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Word not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting word" },
      { status: 500 }
    );
  }
}
