"use client";
import { useState } from "react";
import { getSession } from "next-auth/react";
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

  async function handleSubmit(e) {
    e.preventDefault();
    const germanWord = e.target.germanWord.value.trim();
    const italianWord = e.target.italianWord.value.trim();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    } else if (germanWord.length > 50 || italianWord.length > 50) {
      setError("Die Wörter dürfen nicht länger als 50 Zeichen sein.");
      return;
    }
    try {
      const sessionData = await getSession();
      if (!sessionData) {
        console.log("Session data is undefined.");
        return;
      }
      const userId = sessionData.user.id;
      const response = await fetch(`api/users/${userId}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, germanWord, italianWord }),
      });
      const { message, customWords } = await response.json();
      if (message === "Word already exists") {
        setError("Das Wort ist schon vorhanden.");
        return;
      } else {
        setCustomWords(customWords);
        setFilteredWords(customWords);
        toggleAddModal();
      }
    } catch (error) {
      console.log(error);
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
