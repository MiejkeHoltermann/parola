"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const form = e.target;
        form.reset();
        router.replace("/");
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
        Du hast schon ein Konto?{" "}
        <span className="underline">Jetzt anmelden</span>
      </Link>
    </form>
  );
}
