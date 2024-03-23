import { useEffect, useState } from "react";
import VerbInput from "../VerbInput";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import Hint from "./Hint";
import LoadingAnimation from "../LoadingAnimation";

export default function VerbPractice({
  activeVerb,
  verbData,
  setVerbData,
  correct,
  setCorrect,
  error,
  setError,
  answers,
  setAnswers,
  hint,
  setHint,
  loading,
  newQuestion,
}) {
  const checkAnswer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const trimmedInputs = Array.from(formData.values()).map((value) =>
      value.trim()
    );
    if (trimmedInputs.some((input) => !input)) {
      setError("Alle Felder müssen ausgefüllt sein.");
    } else {
      const isCorrect = trimmedInputs.every(
        (input, index) =>
          input === Object.values(activeVerb.presente)[index].trim()
      );
      setCorrect(isCorrect);
      setError(isCorrect ? "Das ist richtig." : "Versuch es nochmal.");
    }
  };

  return (
    <form
      onSubmit={!correct ? (e) => checkAnswer(e) : (e) => newQuestion(e)}
      id="form"
      className="w-[90%] flex flex-col items-center gap-[1rem] mt-[1rem]"
    >
      {loading ? (
        <LoadingAnimation small />
      ) : (
        <>
          <p className="mb-[1rem]">{activeVerb && activeVerb.name}</p>
          {Object.entries(verbData).map(([key, value], index) => (
            <VerbInput
              key={index}
              index={index}
              value={value}
              verbData={verbData}
              setVerbData={setVerbData}
              inputId={key}
              inputName={key}
              short
            />
          ))}
          {error && <DefaultError errorMessage={error} correct={correct} />}
          {!correct ? (
            <DefaultButton buttonType="submit" buttonText="Prüfen" />
          ) : (
            <DefaultButton buttonType="submit" buttonText="Weiter" />
          )}
          <Hint hint={hint} setHint={setHint} activeVerb={activeVerb} />
        </>
      )}
    </form>
  );
}
