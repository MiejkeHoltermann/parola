"use client";
import { useState } from "react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";
import DefaultError from "../components/DefaultError";

export default function WordForm() {
  const [error, setError] = useState("");
  const [germanWord, setGermanWord] = useState("");
  const [italianWord, setItalianWord] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const germanWord = e.target.germanWord.value.trim();
    const italianWord = e.target.italianWord.value.trim();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    } else if (germanWord.length > 50 || italianWord.length > 50) {
      setError("Keines der Wörter darf mehr als 50 Zeichen betragen.");
      return;
    }
    try {
      const sessionData = await getSession();
      if (!sessionData) {
        console.log("Session data is undefined.");
        return;
      }
      const userId = sessionData.user.id;
      const responseWordExists = await fetch(`api/users/${userId}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, germanWord, italianWord }),
      });
      const { word1, word2, verb } = await responseWordExists.json();
      if (word1 && word2 && word1._id === word2._id) {
        setError("Das Wort ist schon vorhanden");
        return;
      } else if (verb) {
        setError("Das VErb ist schon vorhanden.");
      } else {
        setGermanWord("");
        setItalianWord("");
        router.push("/my-words");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className=" w-full h-full flex flex-col items-center gap-[0.6rem]"
      >
        <Link
          href="/my-words"
          className="ml-auto bg-darkmint flex justify-center items-center text-white w-[1.8rem] h-[1.8rem] rounded-md"
        >
          <Image
            src="/cross.svg"
            alt="close button"
            width={80}
            height={80}
            className="w-[1.5rem] h-[1.5rem]"
          ></Image>
        </Link>
        <h1 className="mt-[2rem]">Füge ein neues Wort hinzu</h1>
        <label htmlFor="germanWord" className="text-[0]">
          Deutsch
        </label>
        <DefaultInput
          value={germanWord}
          setValue={setGermanWord}
          setError={setError}
          inputId="germanWord"
          inputName="germanWord"
          placeholder="Deutsch"
        />
        <DefaultInput
          value={italianWord}
          setValue={setItalianWord}
          setError={setError}
          inputId="italianWord"
          inputName="italianWord"
          placeholder="Italienisch"
        />
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Hinzufügen" />
      </form>
    </main>
  );
}
