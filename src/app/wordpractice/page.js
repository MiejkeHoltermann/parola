"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeForm from "../components/Wordpractice/PracticeForm";
import PracticeList from "../components/Wordpractice/PracticeList";
import DefaultButton from "../components/DefaultButton";
import TipingPracticeForm from "../components/Wordpractice/TipingPracticeForm";
import WordSaladPracticeForm from "../components/Wordpractice/WordsaladPracticeForm";
import MultipleChoicePracticeForm from "../components/Wordpractice/MultipleChoicePracticeForm";
import LoadingAnimation from "../components/LoadingAnimation";
import CloseLink from "../components/CloseLink";

export default function Wordpractise() {
  const [practiceStatus, setPracticeStatus] = useState("practice form");
  const [practiceType, setPracticeType] = useState("Eintippen");
  const [activeWord, setActiveWord] = useState(null);
  const [numberOfWords, setNumberOfWords] = useState(10);
  const [customWords, setCustomWords] = useState([]);
  const [level, setLevel] = useState(6);
  const [answers, setAnswers] = useState(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const updateLevel = async (e) => {
    e.preventDefault();
    const userId = session.user.id;
    const wordId = activeWord._id;
    setLoading(true);
    if (level !== 5) {
      const response = await fetch(`/api/users/${userId}/words`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wordId, level }),
      });
      if (response.ok) {
        console.log("Updated level successfully.");
      }
    } else {
      console.log("Error updating level.");
    }
    setCorrect(false);
    setHint();
    setAnswer("");
    setError("");
    setLoading(false);
    provideNewWord(wordId);
  };

  const provideNewWord = (wordId) => {
    setCustomWords((prevCustomWords) => {
      const newCustomWords = prevCustomWords.filter(
        (word) => word._id !== wordId
      );
      if (newCustomWords.length > 0) {
        const newWord = newCustomWords[index];
        setActiveWord(newWord);
        if (practiceType === "Multiple Choice") {
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

  const reload = () => {
    setPracticeStatus("practice form");
    setNumberOfWords(10);
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : (
        <>
          <CloseLink href="/home" />
          {practiceStatus === "practice form" ? (
            <PracticeForm
              numberOfWords={numberOfWords}
              setNumberOfWords={setNumberOfWords}
              error={error}
              setError={setError}
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
                    Du hast alle Wörter gelernt.
                  </p>
                  <DefaultButton
                    buttonFunction={() => router.push("/home")}
                    buttonType="button"
                    buttonText="Schließen"
                  />
                </>
              ) : practiceType === "Eintippen" ? (
                <TipingPracticeForm
                  activeWord={activeWord}
                  correct={correct}
                  setCorrect={setCorrect}
                  error={error}
                  setError={setError}
                  answer={answer}
                  setAnswer={setAnswer}
                  hint={hint}
                  setHint={setHint}
                  updateLevel={updateLevel}
                  loading={loading}
                ></TipingPracticeForm>
              ) : practiceType === "Wortsalat" ? (
                <WordSaladPracticeForm
                  activeWord={activeWord}
                  correct={correct}
                  setCorrect={setCorrect}
                  error={error}
                  setError={setError}
                  answer={answer}
                  setAnswer={setAnswer}
                  hint={hint}
                  setHint={setHint}
                  updateLevel={updateLevel}
                  loading={loading}
                />
              ) : practiceType === "Multiple Choice" ? (
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
    </main>
  );
}

<CloseLink href="/home" />;
