import { useSession } from "next-auth/react";
import { useState } from "react";

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
        <label htmlFor="germanWord-input" className="text-[0]">
          deutsches Wort
        </label>
        <input
          type="text"
          id="germanWord-input"
          name="germanWord"
          value={activeWord ? activeWord.germanWord : ""}
          readOnly
          className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4 focus:outline-none"
        />
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
                    ? "bg-red-600 shadow-none"
                    : "bg-gray-300 shadow-[2px_2px_rgba(0,215,177,1)]"
                }`}
              >
                {answer}
              </button>
            ))}
          </>
        ) : (
          ""
        )}
        {correct === true ? (
          <p className="text-green-600">Die Antwort ist richtig.</p>
        ) : correct === false ? (
          <p className="text-red-600">Versuch es nochmal.</p>
        ) : null}
        <button
          onClick={newQuestion}
          type="button"
          disabled={!correct}
          className={`mt-4 bg-gray-800 flex justify-center gap-2 w-60 font-bold rounded-xl cursor-pointer px-6 py-2 ${
            correct ? "text-white" : "text-gray-600"
          } `}
        >
          Nächste Frage
        </button>
      </form>
    </>
  );
}
