import VerbInput from "../VerbInput";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import LoadingAnimation from "../LoadingAnimation";
import Hint from "./Hint";
import { useState } from "react";

export default function VerbPractice({
  activeVerb,
  verbData,
  setVerbData,
  correct,
  setCorrect,
  error2,
  setError2,
  hint,
  setHint,
  newQuestion,
  loading,
}) {
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const checkAnswer = (e) => {
    e.preventDefault();
    // checks whether all input fields are valid
    const formData = new FormData(e.target);
    const trimmedInputs = Array.from(formData.values()).map((value) =>
      value.trim()
    );
    if (trimmedInputs.some((input) => !input)) {
      setError2("Please fill out all required fields.");
    }

    // checks whether the inputs are correct
    else {
      const correctAnswers = trimmedInputs.map((input, index) => {
        const isCorrect =
          input === Object.values(activeVerb.presente)[index].trim();
        return isCorrect;
      });
      setCorrectAnswers(correctAnswers);
      const isCorrect = correctAnswers.every((answer) => answer);
      setCorrect(isCorrect);
      setError2(
        isCorrect ? "The answer is correct." : "The answer is not correct."
      );
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
              correctAnswer={correctAnswers[index]}
            />
          ))}
          {error2 && <DefaultError errorMessage={error2} correct={correct} />}{" "}
          <DefaultButton
            buttonType="submit"
            buttonText={!correct ? "Check" : "Next"}
            size="8rem"
          />
          <Hint hint={hint} setHint={setHint} activeVerb={activeVerb} />
        </>
      )}
    </form>
  );
}
