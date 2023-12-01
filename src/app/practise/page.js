"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Practise() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [activeWord, setActiveWord] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState(null);
  const italianWordInputRef = useRef(null);
  const { data: session } = useSession();
  console.log("Level: ", level);
  const { data } = useSWR("/api/words", fetcher);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWord && session && data) {
        const userId = session.user.id;
        try {
          console.log(session.user.id);
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const userData = await response.json();
          const { wordsLevel1 } = userData;
          const { words } = data;
          const user = session.user;
          const unpracticedWords = words.filter(
            (word) => !wordsLevel1.includes(word._id)
          );
          if (unpracticedWords.length > 0) {
            const index = Math.floor(Math.random() * unpracticedWords.length);
            setActiveWord(unpracticedWords[index]);
            setMessage("");
          } else {
            setMessage("Du hast alle Wörter gelernt.");
          }
        } catch (error) {
          console.log("Error fetching user data.", error);
        }
      }
    };
    fetchData();
  }, [data, activeWord, session]);

  useEffect(() => {}, [data, activeWord, session]);

  if (!data) {
    return <p>Loading...</p>;
  }

  function checkAnswer(e) {
    e.preventDefault();
    if (activeWord.italianWord === e.target.form.italianWord.value) {
      setCorrect(true);
      const userId = session.user.id;
      updateWordsLevel1(userId, activeWord._id);
    } else {
      setCorrect(false);
    }
  }

  const updateWordsLevel1 = async (userId, wordId) => {
    try {
      await fetch(`/api/users/${userId}/practiced-words/${wordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wordId }),
      });
    } catch (error) {
      console.error("Error updating practiced words.", error);
    }
  };

  const clearItalianWordInput = () => {
    if (italianWordInputRef.current) {
      italianWordInputRef.current.value = "";
    }
  };

  function newQuestion() {
    setActiveWord(null);
    setCorrect(null);
    setHint(null);
    clearItalianWordInput();
  }

  function showHint() {
    setHint(`${activeWord.germanWord} = ${activeWord.italianWord}`);
  }

  return (
    <main>
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <form id="form" className="w-full flex flex-col items-center gap-6">
            <label htmlFor="germanWord-input" className="text-[0]">
              deutsches Wort
            </label>
            <input
              type="text"
              id="germanWord-input"
              name="germanWord"
              value={activeWord ? activeWord.germanWord : ""}
              readOnly
              className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
            />
            <label htmlFor="italianWord-input" className="text-[0]">
              italienisches Wort
            </label>
            <input
              type="text"
              id="italianWord-input"
              name="italianWord"
              ref={italianWordInputRef}
              className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
            />
            {correct === true ? (
              <p className="text-green-600">Die Antwort ist richtig.</p>
            ) : correct === false ? (
              <p className="text-red-600">Versuch es nochmal.</p>
            ) : null}
            <button
              onClick={correct ? newQuestion : checkAnswer}
              type="button"
              className="py-6 px-8 bg-gray-400 w-80"
            >
              {correct ? "Nächste Frage" : "Prüfen"}
            </button>
          </form>
          <button
            onClick={showHint}
            className="w-full underline flex justify-end pointer-events-auto"
          >
            Lösung anzeigen
          </button>
          {hint ? <p className="w-full flex justify-end">{hint}</p> : null}
        </>
      )}
    </main>
  );
}
