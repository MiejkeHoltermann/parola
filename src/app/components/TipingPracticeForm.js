import { useSession } from "next-auth/react";

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
        const newCustomWords = customWords.filter(
          (word) => word._id != activeWord._id
        );
        setCustomWords(newCustomWords);
      }
    } else {
      setCorrect(false);
    }
  }
  return (
    <>
      <form id="form" className="w-full flex flex-col items-center gap-4">
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
        <label htmlFor="italianWord-input" className="text-[0]">
          italienisches Wort
        </label>
        <input
          type="text"
          id="italianWord-input"
          name="italianWord"
          ref={italianWordInputRef}
          className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4 focus:outline-none focus:outline-lightmint focus:shadow-none"
        />
        {correct === true ? (
          <p className="text-green-600">Die Antwort ist richtig.</p>
        ) : correct === false ? (
          <p className="text-red-600">Versuch es nochmal.</p>
        ) : null}
        <button
          onClick={correct ? newQuestion : checkAnswer}
          type="button"
          className="mt-4 bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
        >
          {correct ? "Nächste Frage" : "Prüfen"}
        </button>
      </form>
    </>
  );
}
