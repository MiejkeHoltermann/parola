import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Word from "@/models/Word";

export async function POST(request) {
  try {
    await connectMongoDB();
    const { germanWord, italianWord } = await request.json();
    const word1 = await Word.findOne({ germanWord }).select("_id");
    const word2 = await Word.findOne({ italianWord }).select("_id");
    console.log(word1, word2);
    return NextResponse.json({ word1, word2 });
  } catch (error) {
    console.log(error);
  }
}
