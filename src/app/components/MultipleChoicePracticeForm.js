import { useSession } from "next-auth/react";
import { useState } from "react";

export default function MultipleChoicePracticeForm({
  activeWord,
  answers,
  italianWordInputRef,
  correct,
  setCorrect,
  newQuestion,
  updateWords,
  level,
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
          eutsches Wort
        </label>

        <input
          type="text"
          id="germanWord-input"
          name="germanWord"
          value={activeWord ? activeWord.germanWord : ""}
          readOnly
          className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
        />

        {answers ? (
          <>
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(answer, index)}
                type="button"
                className={`py-3 px-8 w-60 rounded-lg ${
                  correct && activeWord.italianWord === answer
                    ? "bg-green-600"
                    : clickedIndex === index
                    ? "bg-red-600"
                    : "bg-gray-300"
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

        {correct && (
          <button
            onClick={newQuestion}
            type="button"
            className="py-6 px-8 bg-gray-400 w-80"
          >
            Nächste Frage
          </button>
        )}
      </form>
    </>
  );
}
