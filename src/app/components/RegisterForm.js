"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DefaultButton from "./DefaultButton";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";
import LoadingAnimation from "./LoadingAnimation";

// register

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // checks whether name, email and password input fields are valid
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const nameRegex = /^[a-zA-Z]{4,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?!.*[!@#$%^&*_])[a-zA-Z0-9]{8,20}$/;
    if (!name || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    } else if (!nameRegex.test(name)) {
      setError(
        "Your name has to be between 4 and 10 characters in length and contain only letters."
      );
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please type in a valid e-mail address.");
      return;
    } else if (!passwordRegex.test(password)) {
      setError(
        "Your password has to be at least 8 characters in length and contain at least one digit."
      );
      return;
    }
    setError("");
    setLoading(true);
    // checks whether the user already exists in the database
    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const { user, message } = await response.json();
      if (user) {
        setError("User already exists");
        return;
      }
      // if not a new user is created
      else if (message === "User registered successfully") {
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/import-data",
        });
        setLoading(false);
        router.push("/import-data");
      } else {
        setLoading(false);
        setError("Registration failed");
      }
    } catch (error) {
      setLoading(false);
      setError("Registration failed");
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
          placeholder="Password"
        />
        {loading && <LoadingAnimation small />}
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Sign up" />
      </form>
      <Link className="text-center mt-auto" href={"/"}>
        Already have an account? <br />
        <span className="underline hover:text-mint">Sign in</span> now.
      </Link>
    </>
  );
}
