"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultButton from "../DefaultButton";
import DefaultError from "../DefaultError";
import VerbInput from "../VerbInput";

export default function VerbForm({
  toggleAddModal,
  setCustomVerbs,
  setFilteredVerbs,
}) {
  const [error, setError] = useState("");
  const [verbData, setVerbData] = useState({
    name: "",
    presente01: "",
    presente02: "",
    presente03: "",
    presente04: "",
    presente05: "",
    presente06: "",
  });

  const { data: session } = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    // checks whether all input fields are valid
    const trimmedVerbData = Object.fromEntries(
      Object.entries(verbData).map(([key, value]) => [key, value.trim()])
    );
    const errorMessages = validateInput(trimmedVerbData);
    if (errorMessages.length > 0) {
      setError(errorMessages[0]);
      return;
    }
    // checks whether the new verb already exists in the database
    else if (session) {
      const userId = session.user.id;
      try {
        const response = await fetch(`api/users/${userId}/verbs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            trimmedVerbData,
          }),
        });
        const { verb, customVerbs } = await response.json();
        if (verb) {
          setError("Verb already exists");
          return;
        }
        // if not it creates a new word
        else if (customVerbs) {
          setCustomVerbs(customVerbs);
          setFilteredVerbs(customVerbs);
          toggleAddModal();
          setError("");
        } else {
          setError("Error adding new verb");
        }
      } catch (error) {
        setError("Error adding new verb");
      }
    }
  }

  function validateInput(verbData) {
    const errorMessages = [];
    for (const key in verbData) {
      if (!verbData[key]) {
        errorMessages.push("Alle Felder müssen ausgefüllt sein");
        break;
      }
      if (verbData[key].length > 20) {
        errorMessages.push(
          "Keines der Wörter darf mehr als 20 Zeichen betragen."
        );
        break;
      }
    }
    return errorMessages;
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
        <h1 className="mt-[2rem] mb-[1.4rem]">Füge ein neues Verb hinzu</h1>
        {Object.entries(verbData).map(([key, value], index) => (
          <VerbInput
            key={key}
            index={index}
            value={value}
            verbData={verbData}
            setVerbData={setVerbData}
            inputId={key}
            inputName={key}
          />
        ))}
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Hinzufügen" />
      </form>
    </>
  );
}
