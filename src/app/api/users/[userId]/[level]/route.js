import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId, level } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customWordsFiltered = user.customWords.filter(
      (word) => word.level == level
    );

    return NextResponse.json({ customWordsFiltered }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}
