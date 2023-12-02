import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  const user = await User.findOne({ _id: userId })
    .populate("wordsLevel2")
    .populate("wordsLevel3")
    .populate("wordsLevel4")
    .populate("wordsLevel5");
  const wordsLevel2 = user.wordsLevel2;
  const wordsLevel3 = user.wordsLevel3;
  const wordsLevel4 = user.wordsLevel4;
  const wordsLevel5 = user.wordsLevel5;
  return NextResponse.json(
    { wordsLevel2, wordsLevel3, wordsLevel4, wordsLevel5 },
    { status: 200 }
  );
}
