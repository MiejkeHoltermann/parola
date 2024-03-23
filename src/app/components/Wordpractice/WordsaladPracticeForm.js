import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "fast-shuffle";
import { RxReset } from "react-icons/rx";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import Hint from "./Hint";
import LoadingAnimation from "../LoadingAnimation";

export default function WordSaladPracticeForm({
  activeWord,
  correct,
  setCorrect,
  error,
  setError,
  answer,
  setAnswer,
  hint,
  setHint,
  updateLevel,
  loading,
}) {
  const [shuffledArray, setShuffledArray] = useState([]);
  const [originalLength, setOriginalLength] = useState();

  const { data: session, status } = useSession();

  useEffect(() => {
    const trimmedItalianWord = activeWord.italianWord.trim();
    const wordArray = trimmedItalianWord
      .split("")
      .map((char) => (char === " " ? "\u00A0" : char));
    setShuffledArray(shuffle(wordArray));
    setOriginalLength(wordArray.length);
  }, [status, activeWord]);

  const addToWord = (e, letter, index) => {
    e.preventDefault();
    setAnswer((prevAnswer) => prevAnswer + letter);
    setShuffledArray((prevArray) => {
      const newArray = prevArray.slice();
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const resetWord = (e) => {
    e.preventDefault();
    setError("");
    const newAnswer = answer.slice(0, -1);
    setAnswer(newAnswer);
    setShuffledArray((prevArray) => {
      const lastLetter = answer[answer.length - 1];
      return [...prevArray, lastLetter];
    });
  };

  useEffect(() => {
    if (shuffledArray.length === 0) {
      const normalizedAnswer = answer.replace(/\u00A0/g, " ").trim();
      const normalizedItalianWord = activeWord.italianWord.trim();
      if (normalizedAnswer === normalizedItalianWord) {
        setCorrect(true);
        setError("Die Antwort ist richtig.");
      } else {
        setCorrect(false);
      }
    }
  }, [shuffledArray, answer, activeWord, setCorrect, setError]);

  return (
    <form
      id="form"
      className="w-[90%] flex flex-col items-center gap-[1rem] mt-[1rem]"
    >
      {loading ? (
        <LoadingAnimation small />
      ) : (
        <>
          <p className="mb-[1rem]">{activeWord && activeWord.germanWord}</p>
          <input
            readOnly
            value={answer}
            type="text"
            id="italianWordInput"
            name="italianWordInput"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-lightblue"
          />
          <label htmlFor="italianWordInput" className="text-[0]">
            italian word input
          </label>
          <div className="w-[90%] flex justify-center flex-wrap gap-[0.6rem]">
            {shuffledArray.map((letter, index) => (
              <button
                key={index}
                onClick={(e) => addToWord(e, letter, index)}
                className="bg-superlightblue flex items-center justify-center rounded-md w-[2rem] h-[2.6rem]"
              >
                {letter}
              </button>
            ))}
          </div>
          {!correct && shuffledArray.length < originalLength ? (
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
  );
}
