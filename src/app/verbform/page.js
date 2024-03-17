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
  const [formData, setFormData] = useState({
    name: "",
    presente01: "",
    presente02: "",
    presente03: "",
    presente04: "",
    presente05: "",
    presente06: "",
  });
  const presenteLabels = ["Name", "io", "tu", "lui/lei", "noi", "voi", "loro"];

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
    const { name, presente01 } = trimmedFormData;
    if (!name || !presente01) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    } else if (name.length > 50 || presente01.length > 50) {
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
      const response = await fetch(`api/users/${userId}/verbs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name,
          ...trimmedFormData,
        }),
      });
      const { verb } = await response.json();
      if (verb) {
        setError("Das Verb ist schon vorhanden");
        return;
      } else {
        setFormData({
          name: "",
          presente01: "",
          presente02: "",
          presente03: "",
          presente04: "",
          presente05: "",
          presente06: "",
        });
        router.push("/my-verbs");
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
          href="/my-verbs"
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
        <h1 className="mt-[2rem]">Füge ein neues Verb hinzu</h1>
        {Object.entries(formData).map(([key, value], index) => (
          <div key={key} className="w-[80%] flex justify-between items-center">
            <p>{presenteLabels[index]}</p>
            <DefaultInput
              value={value}
              setValue={(newValue) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [key]: newValue,
                }))
              }
              setError={setError}
              inputId={key}
              inputName={key}
            />
          </div>
        ))}
        {error && <DefaultError errorMessage={error} />}
        <DefaultButton buttonType="submit" buttonText="Hinzufügen" />
      </form>
    </main>
  );
}
