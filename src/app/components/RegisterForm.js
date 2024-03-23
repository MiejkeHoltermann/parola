"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DefaultButton from "./DefaultButton";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const nameRegex = /^[a-zA-Z]{4,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?!.*[!@#$%^&*_])[a-zA-Z0-9]{8,}$/;
    if (!name || !email || !password) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    } else if (!nameRegex.test(name)) {
      setError(
        "Dein Name muss mindestens 4 Zeichen lang sein und darf nur Buchstaben enthalten."
      );
      return;
    } else if (!emailRegex.test(email)) {
      setError("Bitte gib eine gültige E-mail-Adresse ein.");
      return;
    } else if (!passwordRegex.test(password)) {
      setError(
        "Dein Passwort muss mindestens 8 Zeichen lang sein und eine Zahl enthalten."
      );
      return;
    }
    try {
      const responseUserExists = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const { user } = await responseUserExists.json();
      if (user) {
        setError("Zu dieser E-mail-Adresse existiert schon ein Konto.");
        return;
      } else {
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/import-data",
        });
        router.push("/import-data");
      }
    } catch (error) {
      setError(
        "Die Registrierung hat leider nicht funktioniert. Versuch es nochmal."
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[90%] flex flex-col items-center gap-[1rem]"
      >
        <DefaultInput
          value={name}
          setValue={setName}
          setError={setError}
          inputId="name"
          inputName="name"
          placeholder="Name"
        />
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
        <DefaultButton buttonType="submit" buttonText="Registrieren" />
      </form>
      <Link className="text-center mt-auto" href={"/"}>
        Du hast schon ein Konto? <br />
        Jetzt <span className="underline ">anmelden</span>.
      </Link>
    </>
  );
}
