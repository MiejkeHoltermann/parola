import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Word from "@/models/Word";
import User from "@/models/User";
import { uid } from "uid/secure";

export async function POST(req, res) {
  const {
    userId,
    name,
    presente01,
    presente02,
    presente03,
    presente04,
    presente05,
    presente06,
  } = await req.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const _id = uid();
    const newVerb = {
      _id,
      name,
      isFavorite: false,
      presente: {
        presente01: presente01,
        presente02: presente02,
        presente03: presente03,
        presente04: presente04,
        presente05: presente05,
        presente06: presente06,
      },
      imperfetto: {
        imperfetto01: "asdf",
        imperfetto02: "asdf",
        imperfetto03: "saf",
        imperfetto04: "asdf",
        imperfetto05: "sadf",
        imperfetto06: "adsf",
      },
    };
    user.customVerbs = [newVerb, ...user.customVerbs];
    await user.save();
    const newVerbs = user.customVerbs;
    console.log(newVerbs.length);
    return NextResponse.json({ newVerbs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating WordsLevel1." },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongoDB();
  const words = await Word.find();
  return NextResponse.json({ words });
}
