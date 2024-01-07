import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId, level } = params;
  const { searchParams } = new URL(req.url);
  const favoriteWords = searchParams.get("favoriteWords");
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    const customWords = user.customWords;
    return NextResponse.json({ customWords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}

export async function POST(request, response) {
  const { userId, customWords } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    try {
      customWords.forEach((word) => {
        user.activeWords.push(word);
      });
      await user.save();
      return NextResponse.json(
        { message: "Successfully updated active words." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating active words." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}
