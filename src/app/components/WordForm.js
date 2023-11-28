"use client";

import { useState } from "react";

export default function WordForm() {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    const germanWord = e.target.germanWord.value;
    const italianWord = e.target.italianWord.value;
    e.preventDefault();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    }
    try {
      const responseWordExists = await fetch("api/wordExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ germanWord, italianWord }),
      });
      const { word1, word2 } = await responseWordExists.json();
      if (word1 && word2 && word1._id === word2._id) {
        setError("Das Wort ist schon vorhanden.");
        return;
      }
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ germanWord, italianWord }),
      });
      if (response.ok) {
        e.target.reset();
        console.log("Erfolgreich hinzugefügt.");
      } else {
        console.log("Das Wort konnte nicht hinzugefügt werden.");
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
      <label htmlFor="germanWord-input" className="text-darkgreen">
        Gib ein deutsches Wort ein.
      </label>
      <input
        type="text"
        id="germanWord-input"
        name="germanWord"
        className="w-full min-h-[6rem] border border-gray-300 rounded-xl shadow-lg"
      />
      <label htmlFor="italianWord-input" className="text-darkgreen">
        Gib das italienische Wort ein.
      </label>
      <input
        type="text"
        id="italianWord-input"
        name="italianWord"
        className="w-full min-h-[6rem] border border-gray-300 rounded-xl shadow-lg"
      />
      {error && <p className="text-red-800">{error}</p>}
      <button
        type="submit"
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-56"
      >
        Hinzufügen
      </button>
    </form>
  );
}
