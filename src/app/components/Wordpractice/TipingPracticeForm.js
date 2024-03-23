import { useEffect } from "react";
import DefaultInput from "../DefaultInput";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import Hint from "./Hint";
import LoadingAnimation from "../LoadingAnimation";

export default function TipingPracticeForm({
  activeWord,
  correct,
  setCorrect,
  error,
  setError,
  answer,
  setAnswer,
  hint,
  setHint,
  updateLevel,
  loading,
}) {
  useEffect(() => {
    if (activeWord && activeWord.germanWord) {
      document.getElementById("italianWordInput").focus();
    }
  }, [activeWord]);

  const checkAnswer = async (e) => {
    e.preventDefault();
    if (
      activeWord.italianWord.trim() ===
      e.target.elements.italianWordInput.value.trim()
    ) {
      setCorrect(true);
      setError("Die Antwort ist richtig.");
    } else if (e.target.elements.italianWordInput.value.trim() === "") {
      return;
    } else {
      setCorrect(false);
      setError("Das ist nicht die richtige Antwort.");
    }
  };

  return (
    <form
      onSubmit={!correct ? (e) => checkAnswer(e) : (e) => updateLevel(e)}
      id="form"
      className="w-[90%] flex flex-col items-center mt-[1rem] gap-[1rem]"
    >
      {loading ? (
        <LoadingAnimation small />
      ) : (
        <>
          <p className="mb-[1rem]">{activeWord && activeWord.germanWord}</p>
          <DefaultInput
            value={answer}
            setValue={setAnswer}
            setError={setError}
            inputId="italianWordInput"
            name="italianWordInput"
          />
          {error && <DefaultError errorMessage={error} correct={correct} />}{" "}
          {!correct ? (
            <DefaultButton buttonType="submit" buttonText="Prüfen" />
          ) : (
            <DefaultButton buttonType="submit" buttonText="Weiter" />
          )}
          <Hint hint={hint} setHint={setHint} activeWord={activeWord} />
        </>
      )}
    </form>
  );
}
