import { useState } from "react";
import DefaultButton from "../DefaultButton";
import Hint from "./Hint";
import LoadingAnimation from "../LoadingAnimation";

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
      <form
        id="form"
        className="w-[90%] flex flex-col items-center gap-[1rem] mt-[1rem]"
      >
        {loading ? (
          <LoadingAnimation small />
        ) : (
          <>
            <p className="w-[80%] text-center rounded-xl py-[1rem] border border-gray-300 mb-[1rem]">
              {activeWord && activeWord.germanWord}
            </p>
            {answers && (
              <>
                {answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(answer, index)}
                    type="button"
                    className={`w-[80%] bg-darkblue text-white text-center rounded-xl py-[1rem] ${
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
            <DefaultButton
              buttonFunction={updateLevel}
              buttonType="submit"
              buttonText="Weiter"
              disabled={!correct}
            />
            <Hint hint={hint} setHint={setHint} activeWord={activeWord} />
          </>
        )}
      </form>
    </>
  );
}
