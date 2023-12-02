"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response.error) {
        setError("Du hast noch kein Konto");
      }
      router.replace("home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="text"
        placeholder="Passwort"
      />
      <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
        Anmelden
      </button>
      {error && (
        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {error}
        </div>
      )}
      <Link className="text-sm mt-3" href={"/register"}>
        Noch kein Konto? Jetzt <span className="underline">registrieren</span>.
      </Link>
    </form>
  );
}
