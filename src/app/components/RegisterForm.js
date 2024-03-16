"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import DefaultInput from "./DefaultInput";
import DefaultButton from "./DefaultButton";
import DefaultError from "./DefaultError";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nae = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!name || !email || !password) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    } else if (!/^[a-zA-Z]{4,}$/.test(name)) {
      setError(
        "Der Name muss mindestens 4 Zeichen lang sein und darf nur Buchstaben enthalten."
      );
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Bitte gib eine gültige E-mail-Adresse ein.");
      return;
    } else if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,}$/.test(password)
    ) {
      setError(
        "Das Passwort muss mindestens 8 Zeichen lang sein und mindestens eine Zahl und ein Sonderzeichen (!@#$%^&*) enthalten."
      );
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
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center my-[2rem] gap-[2rem]"
      >
        <DefaultInput
          onChange={(e) => setName(e.target.value)}
          inputId="name"
          inputName="name"
          placeholder="Name"
        />
        <DefaultInput
          onChange={(e) => setEmail(e.target.value)}
          inputId="email"
          inputName="email"
          placeholder="E-mail"
        />
        <DefaultInput
          onChange={(e) => setPassword(e.target.value)}
          inputId="password"
          inputName="password"
          placeholder="Passwort"
        />
        <DefaultButton buttonText="Registrieren" />
        {error && <DefaultError errorMessage={error} />}
      </form>
      <Link className="text-center" href={"/"}>
        Du hast schon ein Konto? <br />
        Jetzt <span className="underline ">anmelden</span>.
      </Link>
    </>
  );
}
