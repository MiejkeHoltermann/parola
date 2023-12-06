"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();

  const signOutUser = () => {
    signOut();
    router.push("/");
  };

  return (
    session && (
      <header className="bg-white fixed top-0 left-0 h-16 w-full flex items-center gap-6 px-5 z-10">
        <div className="flex flex-col">
          <button
            onClick={() => setDropdown(!dropdown)}
            type="button"
            className="w-8 h-8 mx-2 bg-transparent"
          >
            <FaUser className="w-6 h-6 " />
          </button>
          {dropdown && (
            <div className="absolute top-14 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a
                    href="/home"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/wordform"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Hinzufügen
                  </a>
                </li>
                <li>
                  <a
                    href="/wordlist-levels"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Lernen
                  </a>
                </li>
                <li>
                  <button
                    onClick={signOutUser}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Abmelden
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <p>{session.user.name}</p>
      </header>
    )
  );
}
