"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="text-darkgreen text-3xl font-bold">
        Hallo, {session?.user?.name}!
      </h1>
      Was möchtest du heute machen?
      <Link
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
        href="/wordform"
      >
        Vokabeln hinzufügen
      </Link>
      <Link
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
        href="/wordlist-levels"
      >
        Vokabeln lernen
      </Link>
      <Link
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
        href="/wordpractice-levels"
      >
        Vokabeln prüfen
      </Link>
      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white font-bold px-6 py-2 mt-3"
      >
        Log Out
      </button>
    </main>
  );
}
