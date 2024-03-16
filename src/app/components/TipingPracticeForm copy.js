import { useSession } from "next-auth/react";
import DefaultInput from "./DefaultInput";
import DefaultError from "./DefaultError";
import DefaultButton from "./DefaultButton";

export default function TipingPracticeForm({
  customWords,
  setCustomWords,
  activeWord,
  italianWordInputRef,
  correct,
  setCorrect,
  newQuestion,
  updateWords,
  level,
  error,
  setError,
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return;
  }

  const userId = session.user.id;

  function checkAnswer(e) {
    e.preventDefault();
    if (activeWord.italianWord === e.target.form.italianWordInput.value) {
      setCorrect(true);
      setError("Die Antwort ist richtig.");
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
      setError("Versuch es nochmal.");
    }
  }

  return (
    <>
      <form id="form" className="w-full flex flex-col items-center gap-4">
        <p>{activeWord && activeWord.germanWord}</p>
        <label htmlFor="italianWord-input" className="text-[0]">
          italienisches Wort
        </label>
        <input
          onDoubleClick={() => (italianWordInputRef.current.value = "")}
          ref={italianWordInputRef}
          type="text"
          id="italianWordInput"
          name="italianWordInput"
          className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-lightblue"
        />
        <label htmlFor="italianWordInput" className="text-[0]">
          italian Word
        </label>
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
