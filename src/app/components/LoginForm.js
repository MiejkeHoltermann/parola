"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DefaultButton from "./DefaultButton";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";

// page.js

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // checks whether email and password input fields are valid
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    if (!email || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    // checks the credentials in the database and performs login if email and password are correct
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response.ok) {
        router.push("/home");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError("Login failed");
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
          placeholder="Password"
        />
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Sign in" />
      </form>
      <Link className="text-center mt-auto" href={"/register"}>
        No account? <br />
        <span className="underline hover:text-mint">Sign up</span> now.
      </Link>
    </>
  );
}
