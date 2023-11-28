import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Word from "@/models/Word";

export async function POST(request) {
  try {
    const { germanWord, italianWord } = await request.json();
    await connectMongoDB();
    await Word.create({ germanWord, italianWord });
    return NextResponse.json(
      { message: "Erfolgreich hinzugefügt." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Es ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
