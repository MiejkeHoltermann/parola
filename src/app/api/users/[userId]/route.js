import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  const user = await User.findOne({ _id: userId });
  const wordsLevel1 = user.wordsLevel1;
  return NextResponse.json({ wordsLevel1 }, { status: 200 });
}
