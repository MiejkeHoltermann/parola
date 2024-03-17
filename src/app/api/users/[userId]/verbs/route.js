import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { uid } from "uid/secure";
import User from "@/models/User";

// my-verbs, verb-conjugator
// retrieves all verbs from the user's account

export async function GET(request, { params }) {
  const { userId } = params;
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const customVerbs = user.customVerbs;
    return NextResponse.json({ customVerbs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving verbs" },
      { status: 500 }
    );
  }
}

// verbform
// checks whether a verb already exists in the database
// if not a new verb is created

export async function POST(request) {
  const {
    userId,
    name,
    presente01,
    presente02,
    presente03,
    presente04,
    presente05,
    presente06,
  } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // does the verb already exist?
    const verb = await user.customVerbs.find((verb) => verb.name === name);
    if (verb) {
      return NextResponse.json({ verb }, { status: 409 });
    }
    // if the verb doesn't exist yet it is created
    else {
      const newVerb = {
        _id: uid(),
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
      return NextResponse.json(
        {
          message: "Verb added successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// VerbCard, FaveButton
/* depending on the parameters it receives the function either
updates the verb or toggles the favorite state */

export async function PUT(request) {
  const {
    userId,
    wordId,
    verbId,
    newName,
    newPresente01,
    newPresente02,
    newPresente03,
    newPresente04,
    newPresente05,
    newPresente06,
  } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // if the parameter newName is passed on, the function is used to edit the existing verb
    if (newName) {
      const updatedVerb = user.customVerbs.id(verbId);
      updatedVerb.name = newName;
      updatedVerb.presente.presente01 = newPresente01;
      updatedVerb.presente.presente02 = newPresente02;
      updatedVerb.presente.presente03 = newPresente03;
      updatedVerb.presente.presente04 = newPresente04;
      updatedVerb.presente.presente05 = newPresente05;
      updatedVerb.presente.presente06 = newPresente06;
      await user.save();
      return NextResponse.json(
        {
          message: "Verb updated successfully",
        },
        { status: 200 }
      );
    }
    // if none of these parameters are passed on, the function toggles the verb's favorite state
    else {
      const currentVerb = user.customVerbs.find(
        (verb) => verb._id.toString() === wordId
      );
      if (currentVerb) {
        currentVerb.isFavorite = !currentVerb.isFavorite;
      } else {
        return NextResponse.json(
          {
            message: "Verb not found",
          },
          { status: 404 }
        );
      }
      await user.save();
      return NextResponse.json(
        {
          message: "Favorite state updated successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error updating favorite state",
      },
      { status: 500 }
    );
  }
}

// VerbCard
// removes a verb from the database

export async function DELETE(request) {
  const { userId, verbId } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const verbIndex = user.customVerbs.findIndex(
      (verb) => verb._id.toString() === verbId
    );
    if (verbIndex !== -1) {
      user.customVerbs.splice(verbIndex, 1);
      await user.save();
      const newCustomVerbs = user.customVerbs;
      console.log(newCustomVerbs);
      return NextResponse.json({ newCustomVerbs }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Verb not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting verb" },
      { status: 500 }
    );
  }
}
