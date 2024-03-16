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
    const customVerbs = user.customVerbs;
    return NextResponse.json({ customVerbs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered words." },
      { status: 500 }
    );
  }
}

export async function POST(request, response) {
  const { userId, number } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    try {
      const customVerbs = user.customVerbs;
      const validNumber = Math.max(0, Math.min(number, customVerbs.length));
      for (let i = 0; i < validNumber; i++) {
        user.activeVerbs.push(customVerbs[i]);
      }
      await user.save();
      return NextResponse.json(
        { message: "Successfully updated active verbs." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating active verbs." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading filtered verbs." },
      { status: 500 }
    );
  }
}
