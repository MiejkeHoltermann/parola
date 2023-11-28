"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="text-darkgreen text-3xl font-bold">
        Hallo, {session?.user?.name}!
      </h1>
      <p>Was möchtest du heute machen?</p>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/addwords"
      >
        Vokabeln hinzufügen
      </Link>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/wordlist"
      >
        Vokabeln üben
      </Link>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/wordpractise"
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
