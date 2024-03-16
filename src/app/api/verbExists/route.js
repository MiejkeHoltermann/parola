import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { userId, name } = await request.json();

  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verb = await user.customVerbs.find((verb) => verb.name === name);

    return NextResponse.json({ verb });
  } catch (error) {
    console.log(error);
  }
}
