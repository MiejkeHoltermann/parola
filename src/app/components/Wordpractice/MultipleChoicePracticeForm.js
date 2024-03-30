import { useState } from "react";
import DefaultButton from "../DefaultButton";
import LoadingAnimation from "../LoadingAnimation";
import Hint from "./Hint";

export default function MultipleChoicePracticeForm({
  activeWord,
  answers,
  correct,
  setCorrect,
  hint,
  setHint,
  updateLevel,
  loading,
}) {
  const [clickedIndex, setClickedIndex] = useState();

  /* checks whether the user clicked the button with the correct answer,
  this button will be displayed green while all wrong buttons are displayed red when clicked */

  function checkAnswer(answer, index) {
    if (activeWord.italianWord === answer) {
      setCorrect(true);
      setClickedIndex(null);
    } else {
      setCorrect(false);
      setClickedIndex(index);
    }
  }

  return (
    <>
      <form id="form" className="w-[90%] flex flex-col items-center gap-[1rem]">
        {loading ? (
          <LoadingAnimation small />
        ) : (
          <>
            <p className="w-[80%] text-center rounded-xl py-[0.8rem] border border-gray-300 mb-[0.6rem]">
              {activeWord && activeWord.englishWord}
            </p>
            {answers && (
              <>
                {answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(answer, index)}
                    type="button"
                    className={`w-[80%] bg-darkblue text-white text-center rounded-xl py-[0.8rem] ${
                      correct && activeWord.italianWord === answer
                        ? "bg-green-600 shadow-none"
                        : clickedIndex === index
                        ? "bg-red-500 shadow-none"
                        : null
                    }`}
                  >
                    {answer}
                  </button>
                ))}
              </>
            )}
            {/* the button for the next question is only enabled when the user gives the right answer */}
            <DefaultButton
              buttonFunction={updateLevel}
              buttonType="submit"
              buttonText="Next"
              disabled={!correct}
              size="8rem"
            />
            <Hint hint={hint} setHint={setHint} activeWord={activeWord} />
          </>
        )}
      </form>
    </>
  );
}
