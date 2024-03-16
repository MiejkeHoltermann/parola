"use client";
import { signOut, useSession } from "next-auth/react";
import DefaultLink from "../components/DefaultLink";
import DefaultButton from "../components/DefaultButton";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="text-darkgreen text-2xl font-bold">
        Hallo, {session?.user?.name}!
      </h1>
      <p className="my-[1rem]">Was möchtest du heute machen?</p>
      <DefaultLink link="/my-words" linkText="Meine Vokabeln" />
      <DefaultLink link="/wordpractice" linkText="Vokabeln lernen" />
      <DefaultLink link="/my-verbs" linkText="Meine Verben" />
      <DefaultLink link="/verb-conjugator" linkText="Verben lernen" />
      <DefaultButton buttonFunction={() => signOut()} buttonText="Abmelden" />
    </main>
  );
}
