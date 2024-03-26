"use client";
import { signOut, useSession } from "next-auth/react";
import DefaultLink from "../components/DefaultLink";
import DefaultButton from "../components/DefaultButton";

// default page when the user is logged in

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="text-2xl font-bold mt-[2rem]">
        Hello, {session?.user?.name}!
      </h1>
      <p className="my-[0.4rem]">Welcome to your account.</p>
      <DefaultLink link="/profile" linkText="My profile" />
      <DefaultLink link="/words" linkText="My words" />
      <DefaultLink link="/wordpractice" linkText="Practice words" />
      <DefaultLink link="/verbs" linkText="My verbs" />
      <DefaultLink link="/verbpractice" linkText="Practice verbs" />
      <DefaultButton
        buttonFunction={() => signOut()}
        buttonType="button"
        buttonText="Sign out"
      />
    </main>
  );
}
