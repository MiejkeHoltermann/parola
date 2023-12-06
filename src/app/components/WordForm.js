"use client";
import { useState } from "react";
import { getSession } from "next-auth/react";

export default function WordForm() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [germanWord, setGermanWord] = useState("");
  const [italianWord, setItalianWord] = useState("");

  const handleChangeGe = (e) => {
    setGermanWord(e.target.value);
  };

  const handleChangeIt = (e) => {
    setItalianWord(e.target.value);
  };

  const handleFocusGe = () => {
    setGermanWord("");
    setError("");
    setSuccessMessage("");
  };

  const handleFocusIt = () => {
    setItalianWord("");
    setError("");
    setSuccessMessage("");
  };

  async function handleSubmit(e) {
    const germanWord = e.target.germanWord.value;
    const italianWord = e.target.italianWord.value;
    e.preventDefault();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    }
    try {
      const sessionData = await getSession();
      if (!sessionData) {
        console.log("Session data is undefined.");
        return;
      }
      const userId = sessionData.user.id;
      const responseWordExists = await fetch("api/wordExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, germanWord, italianWord }),
      });
      const { word1, word2 } = await responseWordExists.json();
      if (word1 && word2 && word1._id === word2._id) {
        setError("Das Wort ist schon vorhanden");
        return;
      }
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, germanWord, italianWord }),
      });
      if (response.ok) {
        setGermanWord("");
        setItalianWord("");
        setSuccessMessage("Erfolgreich hinzugefügt");
      } else {
        console.log("New word could not be created.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col items-center gap-6"
    >
      <label htmlFor="germanWord" className="text-[0]">
        Deutsch
      </label>
      <input
        onChange={handleChangeGe}
        onFocus={handleFocusGe}
        value={germanWord}
        type="text"
        id="germanWord"
        name="germanWord"
        placeholder="Deutsches Wort"
        className="pl-6 w-full min-h-[6rem] border border-gray-300 rounded-xl shadow-lg"
      />
      <label htmlFor="italianWord" className="text-[0]">
        Italienisch
      </label>
      <input
        onChange={handleChangeIt}
        onFocus={handleFocusIt}
        value={italianWord}
        type="text"
        id="italianWord"
        name="italianWord"
        placeholder="Italienische Übersetzung"
        className="pl-6 w-full min-h-[6rem] border border-gray-300 rounded-xl shadow-lg"
      />
      {error && <p className="text-red-600 font-bold">{error}</p>}
      {successMessage && (
        <p className="text-green-600 font-bold">{successMessage}</p>
      )}
      <button
        type="submit"
        className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        Hinzufügen
      </button>
    </form>
  );
}
