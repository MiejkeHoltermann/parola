"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    }
    try {
      const responseUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const { user } = await responseUserExists.json();
      if (user) {
        setError("E-mail schon vorhanden");
        return;
      }
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/import-data",
        });
        router.push("/import-data");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration.", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Name"
      />
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
        Registrieren
      </button>
      {error && (
        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {error}
        </div>
      )}
      <Link className="text-sm mt-3 text-right" href="/">
        Du hast schon ein Konto? Jetzt{" "}
        <span className="underline">anmelden</span>
      </Link>
    </form>
  );
}
