import { useSession } from "next-auth/react";
import { useState } from "react";
import DefaultButton from "./DefaultButton";

export default function MultipleChoicePracticeForm({
  activeWord,
  answers,
  correct,
  setCorrect,
  newQuestion,
  updateWords,
  level,
  customWords,
  setCustomWords,
}) {
  const { data: session, status } = useSession();
  const [clickedIndex, setClickedIndex] = useState();

  if (status === "loading") {
    return;
  }

  const userId = session.user.id;

  function checkAnswer(answer, index) {
    if (activeWord.italianWord === answer) {
      setCorrect(true);
      setClickedIndex(null);
      const userId = session.user.id;
      if (level !== 5) {
        updateWords(userId, level, activeWord._id);
        const newCustomWords = customWords.filter(
          (word) => word._id != activeWord._id
        );
        setCustomWords(newCustomWords);
      }
    } else {
      setCorrect(false);
      setClickedIndex(index);
    }
  }

  return (
    <>
      <form id="form" className="w-full flex flex-col items-center gap-6">
        <p>{activeWord && activeWord.germanWord}</p>
        {answers ? (
          <>
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(answer, index)}
                type="button"
                className={`w-[90%] flex flex-col rounded-xl px-4 py-4 focus:outline-none ${
                  correct && activeWord.italianWord === answer
                    ? "bg-green-600 shadow-none"
                    : clickedIndex === index
                    ? "bg-red-500 shadow-none"
                    : "shadow-[2px_2px_rgba(0,215,177,1)]"
                }`}
              >
                {answer}
              </button>
            ))}
          </>
        ) : (
          ""
        )}
        <button
          onClick={newQuestion}
          disabled={!correct}
          className={`text-${
            correct ? "white" : "gray-600"
          } bg-mint min-w-[8rem] font-bold cursor-pointer rounded-lg px-6 py-2 mt-[2rem] `}
        >
          Weiter
        </button>
      </form>
    </>
  );
}
