import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

/* when a user tries to register it checks whether the e-mail address already exists in the database
if not a new user account is created */

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    const user = await User.findOne({ email }).select("_id");
    if (user) {
      return NextResponse.json({ user });
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
        { message: "User successfully registered." },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
