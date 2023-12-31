"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiClipboardList } from "react-icons/hi";
import { HiHome } from "react-icons/hi";
import { HiLightningBolt } from "react-icons/hi";
import { HiQuestionMarkCircle } from "react-icons/hi";

export default function Footer() {
  const { data: session } = useSession();

  return (
    session && (
      <footer className="bg-white fixed bottom-0 left-0 h-16 w-full flex justify-center items-center gap-6">
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/wordform">
          <HiClipboardList className="w-10 h-10" />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/home">
          <HiHome className="w-10 h-10" />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/verb-form">
          <HiLightningBolt className="w-10 h-10" />
        </Link>
        <Link className="w-8 h-8 mx-2 bg-transparent" href="/wordpractice">
          <HiQuestionMarkCircle className="w-10 h-10" />
        </Link>
      </footer>
    )
  );
}
