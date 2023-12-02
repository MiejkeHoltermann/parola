import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  const user = await User.findOne({ _id: userId })
    .populate("wordsLevel1")
    .populate("wordsLevel2")
    .populate("wordsLevel3")
    .populate("wordsLevel4");
  const wordsLevel1 = user.wordsLevel1;
  const wordsLevel2 = user.wordsLevel2;
  const wordsLevel3 = user.wordsLevel3;
  const wordsLevel4 = user.wordsLevel4;
  return NextResponse.json(
    { wordsLevel1, wordsLevel2, wordsLevel3, wordsLevel4 },
    { status: 200 }
  );
}
