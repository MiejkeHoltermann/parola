import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

// RegisterForm
// checks whether an e-mail address is already registered
// if not a new user account is created

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    const user = await User.findOne({ email }).select("_id");
    if (user) {
      return NextResponse.json({ user }, { status: 409 });
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        customWords: [],
        customVerbs: [],
        wordsImported: false,
      });
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}
