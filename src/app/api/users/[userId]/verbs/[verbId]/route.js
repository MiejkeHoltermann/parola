import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const { userId, verbId } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    try {
      user.activeVerbs = user.activeVerbs.filter((verb) => verb.id !== verbId);
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
