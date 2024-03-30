import { useEffect } from "react";
import DefaultInput from "../DefaultInput";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import LoadingAnimation from "../LoadingAnimation";
import Hint from "./Hint";

// with this practice type the user types in the Italian word

export default function TipingPracticeForm({
  activeWord,
  correct,
  setCorrect,
  error2,
  setError2,
  answer,
  setAnswer,
  hint,
  setHint,
  updateLevel,
  loading,
}) {
  // the input field is automatically focused on

  useEffect(() => {
    if (activeWord && activeWord.englishWord) {
      document.getElementById("italianWordInput").focus();
    }
  }, [activeWord]);

  // checks whether the user input matches the Italian word in the database
  const checkAnswer = async (e) => {
    e.preventDefault();
    const answer = e.target.elements.italianWordInput.value.trim();
    if (answer === "") {
      setError2("Please type something in.");
    } else if (
      activeWord.italianWord.trim() ===
      e.target.elements.italianWordInput.value.trim()
    ) {
      setCorrect(true);
      setError2("The answer is correct.");
    } else if (e.target.elements.italianWordInput.value.trim() === "") {
      return;
    } else {
      setCorrect(false);
      setError2("The answer is not correct.");
    }
  };

  return (
    <>
      <form
        onSubmit={!correct ? (e) => checkAnswer(e) : (e) => updateLevel(e)}
        id="form"
        className="w-[90%] flex flex-col items-center mt-[1rem] gap-[1rem]"
      >
        {loading ? (
          <LoadingAnimation small />
        ) : (
          <>
            <p className="mb-[1rem]">{activeWord && activeWord.englishWord}</p>
            <DefaultInput
              value={answer}
              setValue={setAnswer}
              setError={setError2}
              inputId="italianWordInput"
              name="italianWordInput"
            />
            {error2 && <DefaultError errorMessage={error2} correct={correct} />}{" "}
            <DefaultButton
              buttonType="submit"
              buttonText={!correct ? "Check" : "Next"}
              size="8rem"
            />
            <Hint hint={hint} setHint={setHint} activeWord={activeWord} />
          </>
        )}
      </form>
    </>
  );
}
