"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { data: session } = useSession();

  return (
    session && (
      <footer className="bg-white fixed bottom-0 left-0 h-16 w-full flex justify-center items-center gap-6">
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/">
          <Image
            className="w-8 h-8"
            src="/home-button.svg"
            alt="home button"
            width={100}
            height={100}
          />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/addwords">
          <Image
            className="w-8 h-8"
            src="/add-button.svg"
            alt="add button"
            width={100}
            height={100}
          />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/wordlist">
          <Image
            className="w-8 h-8"
            src="/practise-button.svg"
            alt="practise button"
            width={100}
            height={100}
          />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/practise">
          <Image
            className="w-8 h-8"
            src="/training-button.svg"
            alt="training button"
            width={100}
            height={100}
          />
        </Link>
      </footer>
    )
  );
}
