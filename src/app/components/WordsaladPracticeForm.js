import { useSession } from "next-auth/react";
import { shuffle } from "fast-shuffle";
import { useEffect, useState } from "react";
import { RxReset } from "react-icons/rx";
import DefaultError from "./DefaultError";

export default function WordSaladPracticeForm({
  activeWord,
  italianWordInputRef,
  correct,
  setCorrect,
  newQuestion,
  level,
  customWords,
  setCustomWords,
  error,
  setError,
  updateWords,
}) {
  const [initialShuffledArray, setInitialShuffledArray] = useState([]);
  const [shuffledArray, setShuffledArray] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const wordArray = activeWord ? activeWord.italianWord.split("").trim() : [];
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
      setError("Das ist richtig.");
      const userId = session.user.id;
      if (level !== 5) {
        updateWords(userId, activeWord.level, activeWord._id);
        const newCustomWords = customWords.filter(
          (word) => word._id != activeWord._id
        );
        setCustomWords(newCustomWords);
      }
    } else {
      setCorrect(false);
    }
  };

  const resetWord = (e) => {
    e.preventDefault();
    const currentValue = italianWordInputRef.current.value;
    const newValue = currentValue.slice(0, -1);
    italianWordInputRef.current.value = newValue;
    setShuffledArray((prevArray) => {
      const lastLetter = currentValue[currentValue.length - 1];
      return [...prevArray, lastLetter];
    });
  };

  return (
    <form className="flex flex-col items-center w-full gap-[1.6rem]">
      <p>Test</p>
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
        readOnly
        className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4 focus:outline-none"
      />
      <div className="flex justify-center flex-wrap gap-2 w-[90%] ">
        {shuffledArray.map((letter, index) => (
          <button
            key={index}
            onClick={(e) => addToWord(e, letter, index)}
            className="bg-superlightblue flex items-center justify-center rounded-md p-2 w-7"
          >
            {letter}
          </button>
        ))}
      </div>
      {!correct ? (
        <div className="flex w-[90%] ">
          <button
            onClick={(e) => resetWord(e)}
            className="ml-auto bg-darkmint text-white flex items-center justify-center rounded-md p-2 w-16"
          >
            <RxReset />
          </button>
        </div>
      ) : null}
      {error && <DefaultError errorMessage={error} correct={correct} />}
      <button
        onClick={newQuestion}
        type="button"
        disabled={!correct}
        className={`text-${
          correct ? "white" : "gray-600"
        } bg-mint min-w-[8rem] font-bold cursor-pointer rounded-lg px-6 py-2 mt-[2rem] `}
      >
        Weiter
      </button>
    </form>
  );
}
