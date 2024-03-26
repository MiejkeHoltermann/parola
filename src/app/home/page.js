"use client";
import { signOut, useSession } from "next-auth/react";
import DefaultLink from "../components/DefaultLink";
import DefaultButton from "../components/DefaultButton";

// default page when the user is logged in

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <div
        className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl
    flex flex-col items-center py-[2rem] gap-[1.6rem] mt-[10vh] mb-[6vh]"
      >
        <h1 className="text-2xl font-bold">Hallo, {session?.user?.name}!</h1>
        <p className="w-my-[0.4rem]">Willkommen in deinem Account.</p>
        <DefaultLink link="/profile" linkText="Mein Profil" />
        <DefaultLink link="/words" linkText="Meine Vokabeln" />
        <DefaultLink link="/wordpractice" linkText="Vokabeltrainer" />
        <DefaultLink link="/verbs" linkText="Meine Verben" />
        <DefaultLink link="/verbpractice" linkText="Verbtrainer" />
        <DefaultButton
          buttonFunction={() => signOut()}
          buttonType="button"
          buttonText="Abmelden"
        />
      </div>
    </main>
  );
}
