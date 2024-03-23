"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DefaultButton from "./DefaultButton";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    if (!email || !password) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    }
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response.ok) {
        router.replace("home");
      } else {
        setError("Die Anmeldedaten sind ungültig.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[90%] flex flex-col items-center gap-[1rem]"
      >
        <DefaultInput
          value={email}
          setValue={setEmail}
          setError={setError}
          inputId="email"
          inputName="email"
          placeholder="E-mail"
        />
        <DefaultInput
          value={password}
          setValue={setPassword}
          setError={setError}
          inputId="password"
          inputName="password"
          placeholder="Passwort"
        />
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Anmelden" />
      </form>
      <Link className="text-center mt-auto" href={"/register"}>
        Noch kein Konto? <br />
        Jetzt <span className="underline">registrieren</span>.
      </Link>
    </>
  );
}
