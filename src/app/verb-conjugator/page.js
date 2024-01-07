"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import VerbInputField from "../components/VerbInputField";

export default function VerbConjugator() {
  const [timeform, setTimeform] = useLocalStorageState("timeform", {
    defaultValue: null,
  });
  const [number, setNumber] = useLocalStorageState("number", {
    defaultValue: null,
  });
  const { data: session, status } = useSession();
  const [activeVerb, setActiveVerb] = useState(null);
  const [index, setIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(Array(6).fill(null));
  const [presenteValues, setPresenteValues] = useState(Array(6).fill(""));
  const userId = session?.user?.id;
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const fetchData = async () => {
      if (!activeVerb && userId) {
        try {
          const response = await fetch(`/api/users/${userId}/verbs`, {
            cache: "no-store",
          });
          const { activeVerbs } = await response.json();
          if (activeVerbs.length > 0) {
            setActiveVerb(activeVerbs[index]);
            setIndex((prevIndex) => (prevIndex + 1) % activeVerbs.length);
          } else {
            setMessage1(`Du hast alle Verben gelernt.`);
          }
        } catch (error) {
          console.error("Error fetching data.", error);
        }
      }
    };
    if (status === "authenticated") {
      fetchData();
    }
  }, [activeVerb, index, status, userId]);

  const checkAnswer = (e) => {
    e.preventDefault();

    const newIsCorrect = presenteValues.map(
      (value, i) => value === activeVerb[timeform][`${timeform}0${i + 1}`]
    );

    setIsCorrect(newIsCorrect);

    if (newIsCorrect.every((correct) => correct)) {
      setMessage2("Das war richtig.");
      updateVerbs(userId, activeVerb._id);
    }
  };

  const updateVerbs = async (userId, verbId) => {
    try {
      await fetch(`/api/users/${userId}/verbs/${verbId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verbId }),
      });
    } catch (error) {
      console.error("Error updating practiced verbs.", error);
    }
  };

  const newQuestion = () => {
    setActiveVerb(null);
    setPresenteValues(Array(6).fill(""));
    setIsCorrect(Array(6).fill(null));
    setMessage2("");
  };

  const presenteLabels = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

  return (
    <main>
      {message1 ? (
        <p>{message1}</p>
      ) : (
        <>
          {activeVerb ? (
            <div className="flex flex-col gap-1">
              <p className="text-xl text-darkmint font-bold">
                {activeVerb.name}
              </p>
              <p className="font-bold">{timeform}</p>
            </div>
          ) : (
            ""
          )}
          <form className="flex flex-col items-center gap-[1.6rem] w-full">
            {presenteLabels.map((label, i) => (
              <VerbInputField
                key={i}
                i={i}
                label={label}
                presenteValues={presenteValues}
                setPresenteValues={setPresenteValues}
                isCorrect={isCorrect}
              />
            ))}
            {message2 && (
              <p className="text-green-600">
                {message2}
                {isCorrect}
              </p>
            )}
            <button
              onClick={
                isCorrect.every((correct) => correct)
                  ? newQuestion
                  : checkAnswer
              }
              type="button"
              className="mt-4 bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
            >
              {message2 ? "Nächstes Verb" : "Prüfen"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
