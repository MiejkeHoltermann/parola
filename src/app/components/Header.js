"use client";

import { signOut, useSession } from "next-auth/react";
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

  const closeDropdown = () => {
    setDropdown(false);
  };

  const openDropdown = (e) => {
    setDropdown(!dropdown);
    e.stopPropagation();
  };

  return (
    session && (
      <div onClick={closeDropdown} className="w-full h-full">
        <header className="bg-white fixed top-0 left-0 h-[4rem] w-full flex items-center gap-6 px-5 z-10">
          <div className="flex flex-col">
            <button
              onClick={openDropdown}
              type="button"
              className="w-8 h-8 mx-2 bg-transparent"
            >
              <FaUser className="w-6 h-6 " />
            </button>
            {dropdown && (
              <div className="absolute top-14 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/home"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/my-words"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Meine Vokabeln
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wordpractice"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Vokabeltrainer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Meine Verben
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      href="/verb-form"
                    >
                      Verbtrainer
                    </Link>
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
          <Link href="/profile">{session.user.name}</Link>
        </header>
      </div>
    )
  );
}
