"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
import TipingPracticeForm from "../components/TipingPracticeForm";
import WordSaladPracticeForm from "../components/WordsaladPracticeForm";

export default function Practise() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [practiceType, setPracticeType] = useLocalStorageState("practiceType", {
    defaultValue: null,
  });
  const [activeWord, setActiveWord] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState(null);
  const [index, setIndex] = useState(0);
  const italianWordInputRef = useRef(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const fetchData = async () => {
      const userId = session.user.id;
      if (!activeWord && userId && level) {
        try {
          const response = await fetch(
            `/api/users/${userId}/${level}/activeWords`,
            {
              cache: "no-store",
            }
          );
          const { activeWords } = await response.json();
          if (activeWords.length > 0) {
            function provideNewWord() {
              setActiveWord(activeWords[index]);
              setMessage("");
              setIndex((prevIndex) => (prevIndex + 1) % activeWords.length);
            }
            provideNewWord(index);
          } else {
            setMessage(`Du hast alle Wörter auf Level ${level} gelernt.`);
          }
        } catch (error) {
          console.log("Error fetching user data.", error);
        }
      }
    };
    fetchData();
  }, [activeWord, status, session, level, index]);

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

  function newQuestion() {
    setActiveWord(null);
    setCorrect(null);
    setHint(null);
    italianWordInputRef.current.value = "";
  }

  function showHint() {
    setHint(`${activeWord.germanWord} = ${activeWord.italianWord}`);
  }

  return (
    <main>
      {message ? (
        <p>{message}</p>
      ) : (
        <div className="flex flex-col items-center gap-[1.6rem] w-full ">
          {practiceType === "typing" ? (
            <TipingPracticeForm
              activeWord={activeWord}
              italianWordInputRef={italianWordInputRef}
              correct={correct}
              setCorrect={setCorrect}
              newQuestion={newQuestion}
              updateWords={updateWords}
              level={level}
            />
          ) : practiceType === "wordsalad" ? (
            <WordSaladPracticeForm
              activeWord={activeWord}
              italianWordInputRef={italianWordInputRef}
              correct={correct}
              setCorrect={setCorrect}
              newQuestion={newQuestion}
              updateWords={updateWords}
              level={level}
            />
          ) : null}
          <button
            onClick={showHint}
            className="w-full underline flex justify-end pointer-events-auto"
          >
            Lösung anzeigen
          </button>
          {hint ? <p className="w-full flex justify-end">{hint}</p> : null}
        </div>
      )}
    </main>
  );
}

/* {message ? (
  <p>{message}</p>
) : (
  
)} */
