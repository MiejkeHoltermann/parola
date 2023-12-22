import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId, level } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    const activeWords = user.activeWords;
    const customAnswers = user.customWords.map((word) => word.italianWord);
    const shuffledAnswers = [...customAnswers].sort(() => Math.random() - 0.5);
    const multipleChoiceAnswers = shuffledAnswers.slice(0, 3);
    return NextResponse.json(
      { activeWords, multipleChoiceAnswers },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}
