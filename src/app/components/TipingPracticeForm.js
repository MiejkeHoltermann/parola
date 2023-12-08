import { useSession } from "next-auth/react";

export default function TipingPracticeForm({
  activeWord,
  italianWordInputRef,
  correct,
  setCorrect,
  newQuestion,
  updateWords,
  level,
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return;
  }

  const userId = session.user.id;

  function checkAnswer(e) {
    e.preventDefault();
    if (activeWord.italianWord === e.target.form.italianWord.value) {
      setCorrect(true);
      const userId = session.user.id;
      if (level !== 5) {
        updateWords(userId, level, activeWord._id);
      }
    } else {
      setCorrect(false);
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
          className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
        />
        <label htmlFor="italianWord-input" className="text-[0]">
          italienisches Wort
        </label>
        <input
          type="text"
          id="italianWord-input"
          name="italianWord"
          ref={italianWordInputRef}
          className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
        />
        {correct === true ? (
          <p className="text-green-600">Die Antwort ist richtig.</p>
        ) : correct === false ? (
          <p className="text-red-600">Versuch es nochmal.</p>
        ) : null}
        <button
          onClick={correct ? newQuestion : checkAnswer}
          type="button"
          className="py-6 px-8 bg-gray-400 w-80"
        >
          {correct ? "Nächste Frage" : "Prüfen"}
        </button>
      </form>
    </>
  );
}
