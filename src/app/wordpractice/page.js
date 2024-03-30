"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeForm from "../components/Wordpractice/PracticeForm";
import PracticeList from "../components/Wordpractice/PracticeList";
import DefaultButton from "../components/DefaultButton";
import TipingPracticeForm from "../components/Wordpractice/TipingPracticeForm";
import WordScramblePracticeForm from "../components/Wordpractice/WordScramblePracticeForm";
import MultipleChoicePracticeForm from "../components/Wordpractice/MultipleChoicePracticeForm";
import LoadingAnimation from "../components/LoadingAnimation";
import CloseLink from "../components/CloseLink";
import DefaultError from "../components/DefaultError";

export default function Wordpractice() {
  const [practiceStatus, setPracticeStatus] = useState("practice form");
  const [practiceType, setPracticeType] = useState("Typing");
  const [activeWord, setActiveWord] = useState(null);
  const [numberOfWords, setNumberOfWords] = useState(10);
  const [customWords, setCustomWords] = useState([]);
  const [level, setLevel] = useState(6);
  const [answers, setAnswers] = useState(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // if a user gives the correct translation for a word, this word is automatically raised up one level

  const updateLevel = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (session && level !== 5) {
      const userId = session.user.id;
      const wordId = activeWord._id;
      try {
        const response = await fetch(`/api/users/${userId}/words`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, wordId, level }),
        });
        if (response.ok) {
          setCorrect(false);
          setHint();
          setAnswer("");
          setError("");
          setError2("");
          setLoading(false);
          provideNewWord(wordId);
        } else {
          setError("Error updating level");
        }
      } catch (error) {
        setError("Error updating level");
      }
    }
  };

  // after the user gave a correct answer and the level was updated the next word is provided
  /* if the practice type is multiple choice
  it is checked whether the correct answer is already one of the 4 randomly chosen answers,
  if not one of the wrong answers is replaced by the correct answer,
  the correct answer is given a random index so it might be any of the 4 options*/

  const provideNewWord = (wordId) => {
    setCustomWords((prevCustomWords) => {
      const newCustomWords = prevCustomWords.filter(
        (word) => word._id !== wordId
      );
      if (newCustomWords.length > 0) {
        const newWord = newCustomWords[index];
        setActiveWord(newWord);
        if (practiceType === "Multiple choice") {
          const correctAnswer = newWord.italianWord;
          const correctAnswerIndex =
            multipleChoiceAnswers.indexOf(correctAnswer);
          const randomIndex =
            correctAnswerIndex === -1
              ? Math.floor(Math.random() * multipleChoiceAnswers.length)
              : correctAnswerIndex;
          const updatedMultipleChoiceAnswers = [
            ...multipleChoiceAnswers.slice(0, randomIndex),
            correctAnswer,
            ...multipleChoiceAnswers.slice(randomIndex + 1),
          ];
          setAnswers(updatedMultipleChoiceAnswers);
        }
        setPracticeStatus("practice");
      }
      return newCustomWords;
    });
  };

  // in case the user choses criteria which match none of their words they can reload the page and try again

  const reload = () => {
    setPracticeStatus("practice form");
    setNumberOfWords(10);
    setLevel(6);
  };

  console.log(practiceType);

  return (
    <main>
      <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
        {status === "loading" ? (
          <LoadingAnimation />
        ) : error ? (
          <>
            <CloseLink href="/home" />
            {error && <DefaultError errorMessage={error} correct={correct} />}
          </>
        ) : (
          <>
            <CloseLink href="/home" />
            {practiceStatus === "practice form" ? (
              <PracticeForm
                numberOfWords={numberOfWords}
                setNumberOfWords={setNumberOfWords}
                error={error}
                setError={setError}
                error2={error2}
                setError2={setError2}
                level={level}
                setLevel={setLevel}
                practiceType={practiceType}
                setPracticeType={setPracticeType}
                setCustomWords={setCustomWords}
                setPracticeStatus={setPracticeStatus}
                setMultipleChoiceAnswers={setMultipleChoiceAnswers}
              />
            ) : practiceStatus === "practice list" ? (
              <PracticeList
                customWords={customWords}
                provideNewWord={provideNewWord}
                reload={reload}
              />
            ) : practiceStatus === "practice" ? (
              <div className="flex flex-col items-center gap-[1.6rem] w-full ">
                {customWords.length === 0 ? (
                  <>
                    <p className="text-center mt-[2rem]">
                      You have practiced all words.
                    </p>
                    <DefaultButton
                      buttonFunction={() => router.push("/home")}
                      buttonType="button"
                      buttonText="Close"
                    />
                  </>
                ) : practiceType === "Typing" ? (
                  <TipingPracticeForm
                    activeWord={activeWord}
                    correct={correct}
                    setCorrect={setCorrect}
                    error2={error2}
                    setError2={setError2}
                    answer={answer}
                    setAnswer={setAnswer}
                    hint={hint}
                    setHint={setHint}
                    updateLevel={updateLevel}
                    loading={loading}
                  ></TipingPracticeForm>
                ) : practiceType === "Wordscramble" ? (
                  <WordScramblePracticeForm
                    activeWord={activeWord}
                    correct={correct}
                    setCorrect={setCorrect}
                    error2={error2}
                    setError2={setError2}
                    answer={answer}
                    setAnswer={setAnswer}
                    hint={hint}
                    setHint={setHint}
                    updateLevel={updateLevel}
                    loading={loading}
                  />
                ) : practiceType === "Multiple choice" ? (
                  <MultipleChoicePracticeForm
                    activeWord={activeWord}
                    answers={answers}
                    correct={correct}
                    setCorrect={setCorrect}
                    hint={hint}
                    setHint={setHint}
                    updateLevel={updateLevel}
                    loading={loading}
                  />
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
