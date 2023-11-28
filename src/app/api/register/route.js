import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(
      { message: "User successfully registered." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "User could not be registered." },
      { status: 500 }
    );
  }
}
