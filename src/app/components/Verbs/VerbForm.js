"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultButton from "../DefaultButton";
import DefaultError from "../DefaultError";
import VerbInput from "../VerbInput";
import CloseButton from "../CloseButton";

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
        errorMessages.push("Please fill out all required fields.");
        break;
      }
      if (verbData[key].length > 20) {
        errorMessages.push("No input can be longer than 20 characters.");
        break;
      }
    }
    return errorMessages;
  }

  return (
    <>
      <CloseButton buttonFunction={toggleAddModal} />
      <form
        onSubmit={handleSubmit}
        className=" w-full h-full flex flex-col items-center gap-[0.6rem]"
      >
        <h1 className="mt-[2rem] mb-[1.4rem]">Add a new verb</h1>
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
        <DefaultButton buttonType="submit" buttonText="Add" size="6rem" />
      </form>
    </>
  );
}
