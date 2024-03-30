"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefaultLink from "../components/DefaultLink";
import DefaultButton from "../components/DefaultButton";
import LoadingAnimation from "../components/LoadingAnimation";

// default page when the user is logged in

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    console.log("unauthenticated");
    router.push("/");
  }

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : (
        <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
          {session && (
            <h1 className="text-2xl font-bold">Hello, {session.user.name}!</h1>
          )}
          <p className="w-my-[0.4rem]">Welcome to your account.</p>
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
        </div>
      )}
    </main>
  );
}
