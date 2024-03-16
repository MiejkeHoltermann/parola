"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "./DefaultButton";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !password) {
      setError("Alle Felder müssen ausgefüllt sein.");
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
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response.error) {
        setError("Du hast noch kein Konto bei uns.");
      }
      router.replace("home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center my-[2rem] gap-[2rem]"
      >
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
        <DefaultButton buttonText="Anmelden" />
        {error && <DefaultError errorMessage={error} />}
      </form>
      <Link className="text-center" href={"/register"}>
        Kein Konto? <br />
        Jetzt <span className="underline ">registrieren</span>.
      </Link>
    </>
  );
}
