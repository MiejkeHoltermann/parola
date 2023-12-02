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
  const { data } = useSWR("/api/words", fetcher);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWord && session && data && level !== null) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const userData = await response.json();
          const { wordsLevel1, wordsLevel2, wordsLevel3, wordsLevel4 } =
            userData;
          const { words } = data;
          const user = session.user;
          const wordsLevel0 = words.filter((word) => {
            return ![1, 2, 3, 4].some((level) =>
              userData[`wordsLevel${level}`].some(
                (levelWord) => levelWord._id === word._id
              )
            );
          });
          if (level === 0) {
            if (wordsLevel0.length > 0) {
              const index = Math.floor(Math.random() * wordsLevel0.length);
              setActiveWord(wordsLevel0[index]);
              setMessage("");
            } else {
              setMessage("Du hast alle Wörter auf Level 0 gelernt.");
            }
          } else if (level === 1) {
            if (wordsLevel1.length > 0) {
              const index = Math.floor(Math.random() * wordsLevel1.length);
              setActiveWord(wordsLevel1[index]);
              setMessage("");
            } else {
              setMessage("Du hast alle Wörter auf Level 1 gelernt.");
            }
          } else if (level === 2) {
            if (wordsLevel2.length > 0) {
              const index = Math.floor(Math.random() * wordsLevel2.length);
              setActiveWord(wordsLevel2[index]);
              setMessage("");
            } else {
              setMessage("Du hast alle Wörter auf Level 2 gelernt.");
            }
          } else if (level === 3) {
            if (wordsLevel3.length > 0) {
              const index = Math.floor(Math.random() * wordsLevel3.length);
              setActiveWord(wordsLevel3[index]);
              setMessage("");
            } else {
              setMessage("Du hast alle Wörter auf Level 3 gelernt.");
            }
          } else if (level === 4) {
            if (wordsLevel4.length > 0) {
              const index = Math.floor(Math.random() * wordsLevel4.length);
              setActiveWord(wordsLevel4[index]);
              setMessage("");
            } else {
              setMessage("Du hast alle Wörter auf Level 4 gelernt.");
            }
          } else {
            console.log("Du hast kein Level ausgewählt.");
          }
        } catch (error) {
          console.log("Error fetching user data.", error);
        }
      }
    };
    fetchData();
  }, [data, activeWord, session, level]);

  if (!data) {
    return <p>Loading...</p>;
  }

  function checkAnswer(e) {
    e.preventDefault();
    if (activeWord.italianWord === e.target.form.italianWord.value) {
      setCorrect(true);
      const userId = session.user.id;
      if (level !== 4) {
        updateWords(userId, level, activeWord._id);
      }
    } else {
      setCorrect(false);
    }
  }

  const updateWords = async (userId, level, wordId) => {
    try {
      await fetch(`/api/users/${userId}/${level}/${wordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, level, wordId }),
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
