import { useSession } from "next-auth/react";
import { shuffle } from "fast-shuffle";
import { useEffect, useRef, useState } from "react";
import { RxReset } from "react-icons/rx";

export default function WordSaladPracticeForm({
  activeWord,
  italianWordInputRef,
  correct,
  setCorrect,
  newQuestion,
  updateWords,
  level,
}) {
  const [initialShuffledArray, setInitialShuffledArray] = useState([]);
  const [shuffledArray, setShuffledArray] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const wordArray = activeWord ? activeWord.italianWord.split("") : [];
    setInitialShuffledArray(shuffle(wordArray));
    setShuffledArray(shuffle(wordArray));
  }, [status, activeWord]);

  const addToWord = (e, letter, index) => {
    e.preventDefault();
    italianWordInputRef.current.value += letter;
    setShuffledArray((prevArray) => {
      const newArray = prevArray.slice();
      newArray.splice(index, 1);
      return newArray;
    });

    if (italianWordInputRef.current.value === activeWord.italianWord) {
      setCorrect(true);
      const userId = session.user.id;
      if (level !== 5) {
        updateWords(userId, level, activeWord._id);
      }
    } else {
      setCorrect(false);
    }
  };

  const resetWord = (e) => {
    e.preventDefault();
    italianWordInputRef.current.value = "";
    setShuffledArray([...initialShuffledArray]);
  };

  return (
    <form className="flex flex-col items-center w-full gap-[1.6rem]">
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
        readOnly
        className="py-4 px-6 w-full border-gray-400 rounded-xl shadow-xl"
      />
      <div className="flex w-full">
        <div className="flex flex-start gap-2 w-full ml-16">
          {shuffledArray.map((letter, index) => (
            <button
              key={index}
              onClick={(e) => addToWord(e, letter, index)}
              className="border-solid border-2 border-gray-400 flex items-center justify-center rounded-md p-2 w-10"
            >
              {letter}
            </button>
          ))}
        </div>
        {!correct ? (
          <button
            onClick={(e) => resetWord(e)}
            className="border-solid border-2 border-gray-400 flex items-center justify-center rounded-md p-2 w-16 mr-16"
          >
            <RxReset />
          </button>
        ) : null}
      </div>
      {correct === true ? (
        <p className="text-green-600">Die Antwort ist richtig.</p>
      ) : correct === false && shuffledArray.length === 0 ? (
        <p className="text-red-600">Versuch es nochmal.</p>
      ) : null}
      <button
        onClick={newQuestion}
        disabled={shuffledArray.length > 0}
        type="button"
        className={`bg-gray-400 py-6 px-8 w-80 ${
          shuffledArray.length > 0 ? "text-gray-500" : "text-black"
        } `}
      >
        Nächste Frage
      </button>
    </form>
  );
}
