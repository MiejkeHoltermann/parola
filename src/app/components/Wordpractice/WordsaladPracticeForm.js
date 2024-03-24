import { useEffect, useState } from "react";
import { shuffle } from "fast-shuffle";
import { RxReset } from "react-icons/rx";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import LoadingAnimation from "../LoadingAnimation";
import Hint from "./Hint";

/* with this practice type the user is presented with a little button
for each letter of the correct answer, mixed up in random order,
they have to click the buttons in the right order to answer the questions correctly*/

export default function WordSaladPracticeForm({
  activeWord,
  correct,
  setCorrect,
  error2,
  setError2,
  answer,
  setAnswer,
  hint,
  setHint,
  updateLevel,
  loading,
}) {
  const [shuffledArray, setShuffledArray] = useState([]);
  const [originalLength, setOriginalLength] = useState();

  // the correct Italian word is split between each character to create a number of buttons in random orrder

  useEffect(() => {
    const trimmedItalianWord = activeWord.italianWord.trim();
    const wordArray = trimmedItalianWord
      .split("")
      .map((char) => (char === " " ? "\u00A0" : char));
    setShuffledArray(shuffle(wordArray));
    setOriginalLength(wordArray.length);
  }, [activeWord]);

  // when the user clicks on one of those buttons the letter is added to the answer

  const addToWord = (e, letter, index) => {
    e.preventDefault();
    setAnswer((prevAnswer) => prevAnswer + letter);
    setShuffledArray((prevArray) => {
      const newArray = prevArray.slice();
      newArray.splice(index, 1);
      return newArray;
    });
  };

  // if they made a mistake the user can click the reset button to remove the last letter

  const resetWord = (e) => {
    e.preventDefault();
    setError2("");
    const newAnswer = answer.slice(0, -1);
    setAnswer(newAnswer);
    setShuffledArray((prevArray) => {
      const lastLetter = answer[answer.length - 1];
      return [...prevArray, lastLetter];
    });
  };

  /* React uses different versions of the space character
  so both the user's answer and the correct Italian word have to be normalized before they can be compared */

  useEffect(() => {
    if (shuffledArray.length === 0) {
      const normalizedAnswer = answer.replace(/\u00A0/g, " ").trim();
      const normalizedItalianWord = activeWord.italianWord.trim();
      if (normalizedAnswer === normalizedItalianWord) {
        setCorrect(true);
        setError2("Die Antwort ist richtig.");
      } else {
        setCorrect(false);
      }
    }
  }, [shuffledArray, answer, activeWord, setCorrect, setError2]);

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
          {error2 && <DefaultError errorMessage={error2} correct={correct} />}
          {/* the button for the next question is only enabled when the user gives the right answer */}
          <DefaultButton
            buttonFunction={updateLevel}
            buttonType="button"
            buttonText="Weiter"
            disabled={!correct}
            size="8rem"
          />
          <Hint hint={hint} setHint={setHint} activeWord={activeWord} />
        </>
      )}
    </form>
  );
}
