"use client";
import { useSession } from "next-auth/react";
import DefaultError from "./DefaultError";
import DefaultButton from "./DefaultButton";
import VerbInput from "./VerbInput";
import { useState } from "react";

export default function VerbPractice({
  customVerbs,
  setCustomVerbs,
  activeVerb,
  setActiveVerb,
  answers,
  setAnswers,
  level,
  correct,
  setCorrect,
  error,
  setError,
  number,
  timeform,
  newQuestion,
}) {
  const { data: session, status } = useSession();
  const [isCorrect, setIsCorrect] = useState(Array(6).fill(null));
  const [presenteValues, setPresenteValues] = useState(Array(6).fill(""));
  const presenteLabels = ["io", "tu", "lei/lui", "noi", "voi", "loro"];

  if (status === "loading") {
    return;
  }

  const userId = session.user.id;

  const checkAnswer = (e) => {
    e.preventDefault();
    const newIsCorrect = presenteValues.map(
      (value, i) => value === activeVerb[timeform][`${timeform}0${i + 1}`]
    );
    setIsCorrect(newIsCorrect);
    if (newIsCorrect.every((correct) => correct)) {
      setCorrect(true);
      setError("Das war richtig.");
      const newCustomVerbs = customVerbs.filter(
        (verb) => verb._id != activeVerb._id
      );
      setCustomVerbs(newCustomVerbs);
    } else {
      setCorrect(false);
      setError("Versuch es nochmal.");
    }
  };

  return (
    <>
      <form id="form" className="w-full flex flex-col items-center gap-4">
        <p className="font-bold">{activeVerb && activeVerb.name}</p>
        {presenteLabels.map((label, index) => (
          <VerbInput
            key={index}
            inputId={`presente${index + 1}`}
            inputName={`presente${index + 1}`}
            presenteValues={presenteValues}
            setPresenteValues={setPresenteValues}
            isCorrect={isCorrect}
            index={index}
            label={label}
          />
        ))}
        {error && <DefaultError errorMessage={error} correct={correct} />}
        {!correct ? (
          <DefaultButton
            buttonFunction={checkAnswer}
            buttonType="button"
            buttonText="Prüfen"
          />
        ) : (
          <DefaultButton
            buttonFunction={newQuestion}
            buttonType="button"
            buttonText="Weiter"
          />
        )}
      </form>
    </>
  );
}
