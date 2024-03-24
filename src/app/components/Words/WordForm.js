"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultInput from "../DefaultInput";
import DefaultButton from "../DefaultButton";
import DefaultError from "../DefaultError";

export default function WordForm({
  toggleAddModal,
  setCustomWords,
  setFilteredWords,
}) {
  const [germanWord, setGermanWord] = useState("");
  const [italianWord, setItalianWord] = useState("");
  const [error, setError] = useState("");

  const { data: session } = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    // checks whether all input fields are valid
    const germanWord = e.target.germanWord.value.trim();
    const italianWord = e.target.italianWord.value.trim();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    } else if (germanWord.length > 20 || italianWord.length > 20) {
      setError("Die Wörter dürfen nicht länger als 20 Zeichen sein.");
      return;
    }
    // checks whether the new word already exists in the database
    if (session) {
      const userId = session.user.id;
      try {
        const response = await fetch(`api/users/${userId}/words`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, germanWord, italianWord }),
        });
        const { message, customWords } = await response.json();
        if (message === "Word already exists") {
          setError("Word already exists");
          return;
        }
        // if not it creates a new word
        else if (customWords) {
          setCustomWords(customWords);
          setFilteredWords(customWords);
          toggleAddModal();
          setError("");
        } else {
          setError("Error adding new word");
        }
      } catch (error) {
        setError("Error adding new word");
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" w-full h-full flex flex-col items-center gap-[0.6rem]"
      >
        <button
          onClick={toggleAddModal}
          type="button"
          className="ml-auto bg-mint flex justify-center items-center text-white w-[1.6rem] h-[1.6rem] rounded-md"
        >
          <Image
            src="/cross.svg"
            alt="close button"
            width={50}
            height={50}
            className="w-[1.5rem] h-[1.5rem]"
          ></Image>
        </button>
        <h1 className="mt-[2rem] mb-[1.4rem]">Füge ein neues Wort hinzu</h1>
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
    </>
  );
}