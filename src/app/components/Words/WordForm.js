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
  const [englishWord, setEnglishWord] = useState("");
  const [italianWord, setItalianWord] = useState("");
  const [error, setError] = useState("");

  const { data: session } = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    // checks whether all input fields are valid
    const englishWord = e.target.englishWord.value.trim();
    const italianWord = e.target.italianWord.value.trim();
    if (!englishWord || !italianWord) {
      setError("Please fill out all required fields.");
      return;
    } else if (englishWord.length > 20 || italianWord.length > 20) {
      setError("No input can be longer than 20 characters.");
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
          body: JSON.stringify({ userId, englishWord, italianWord }),
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
        <h1 className="mt-[2rem] mb-[1.4rem]">Add a new word</h1>
        <DefaultInput
          value={englishWord}
          setValue={setEnglishWord}
          setError={setError}
          inputId="englishWord"
          inputName="englishWord"
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
        <DefaultButton buttonType="submit" buttonText="Add" />
      </form>
    </>
  );
}
