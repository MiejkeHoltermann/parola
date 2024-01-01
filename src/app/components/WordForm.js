"use client";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function WordForm({
  toggleWordForm,
  setNewWord,
  setCustomWords,
}) {
  const [error, setError] = useState("");
  const [germanWord, setGermanWord] = useState("");
  const [italianWord, setItalianWord] = useState("");

  const router = useRouter();

  const handleChangeGe = (e) => {
    setGermanWord(e.target.value);
  };

  const handleChangeIt = (e) => {
    setItalianWord(e.target.value);
  };

  const handleFocusGe = () => {
    setGermanWord("");
    setError("");
  };

  const handleFocusIt = () => {
    setItalianWord("");
    setError("");
  };

  async function handleSubmit(e) {
    const germanWord = e.target.germanWord.value.trim();
    const italianWord = e.target.italianWord.value.trim();
    e.preventDefault();
    if (!germanWord || !italianWord) {
      setError("Alle Felder müssen ausgefüllt sein");
      return;
    }
    if (germanWord.length > 50 || italianWord.length > 50) {
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
      const { wordId, newWords } = await response.json();
      if (response.ok) {
        setGermanWord("");
        setItalianWord("");
        toggleWordForm();
        setNewWord(wordId);
        setCustomWords(newWords);
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
      className="w-full h-full flex flex-col items-center"
    >
      <button onClick={toggleWordForm} className="ml-auto my-0">
        <IoClose size={32} />
      </button>
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
        className="pl-6 w-full min-h-[3rem] border border-gray-300 rounded-xl shadow-lg mb-3"
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
        className="pl-6 w-full min-h-[3rem] border border-gray-300 rounded-xl shadow-lg"
      />
      {error && <p className="text-red-600 font-bold mt-2">{error}</p>}
      <button
        type="submit"
        className="my-[1rem] bg-darkmint flex justify-center gap-2 text-white w-40 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        Hinzufügen
      </button>
    </form>
  );
}
