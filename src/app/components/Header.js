"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    session && (
      <header className="bg-mint fixed top-0 left-0 h-[4rem] w-full flex items-center z-10 min-[450px]:w-[450px] min-[450px]:left-[50%] min-[450px]:-translate-x-1/2">
        <div className="flex flex-col">
          <button
            onClick={toggleDropdown}
            type="button"
            className="w-[4rem] h-[4rem] bg-transparent fixed top-[0.8rem] left-[3rem] z-30"
          >
            <Image
              src="/profile-pic.jpg"
              alt="profile-picture"
              width={100}
              height={100}
              className="rounded-[50%]"
            />
          </button>
          {dropdown && (
            <div className="absolute top-[4rem] left-[5vw] z-20 bg-white rounded-b-lg shadow w-[10.4rem]">
              <ul className="pt-[2rem] pb-[1rem] px-[1rem]">
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/home">Home</Link>
                </li>
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/profile">My profile</Link>
                </li>
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/words">My words</Link>
                </li>
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/wordpractice">Practice words</Link>
                </li>
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/verbs">My verbs</Link>
                </li>
                <li onClick={toggleDropdown} className="py-[0.3rem]">
                  <Link href="/verbpractice">Practice verbs</Link>
                </li>
                <li className="py-[0.3rem]">
                  <button
                    onClick={() => signOut()}
                    className="text-mint font-bold mt-[0.4rem]"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <Link
          href="/profile"
          alt="profile link"
          className="text-white text-lg font-bold fixed top-[1.4rem] left-[8.6rem] z-30"
        >
          {session.user.name}
        </Link>
      </header>
    )
  );
}
