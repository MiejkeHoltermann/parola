import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { userId, level, wordId } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const word = user.customWords.find(
      (word) => word._id.toString() === wordId
    );
    if (!word) {
      return res.status(404).json({ message: "Word not found." });
    }
    word.level = parseInt(level) + 1;
    const activeWordIndex = user.activeWords.findIndex(
      (word) => word._id.toString() === wordId
    );
    if (activeWordIndex === -1) {
      return res.status(404).json({ message: "Active word not found." });
    }
    user.activeWords.splice(activeWordIndex, 1);
    await user.save();
    return NextResponse.json(
      { message: "Word added to this level." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating this level." },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { userId, wordId } = params;
  await connectMongoDB();
  console.log("ok");
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    const customAnswers = user.customWords.map((word) => word.italianWord);
    const shuffledAnswers = [...customAnswers].sort(() => Math.random() - 0.5);
    const multipleChoiceAnswers = shuffledAnswers.slice(0, 3);
    return NextResponse.json({ multipleChoiceAnswers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}
