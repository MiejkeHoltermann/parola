"use client";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import TipingPracticeForm from "../components/TipingPracticeForm";
import WordSaladPracticeForm from "../components/WordsaladPracticeForm";
import MultipleChoicePracticeForm from "../components/MultipleChoicePracticeForm";
import { shuffle } from "fast-shuffle";
import PracticeForm from "../components/PracticeForm";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";
import PracticeList from "../components/PracticeList";

export default function Practise() {
  const [level, setLevel] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [message2, setMessage2] = useState("");
  const [hint, setHint] = useState(null);
  const [index, setIndex] = useState(0);
  const italianWordInputRef = useRef(null);
  const { data: session, status } = useSession();
  const [answers, setAnswers] = useState(null);
  const [number, setNumber] = useState(0);
  const [favoriteWords, setFavoriteWords] = useState(false);
  const [customWords, setCustomWords] = useState([]);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const [practiceForm, setPracticeForm] = useState(true);
  const [practiceList, setPracticeList] = useState(false);
  const [tipingPracticeForm, setTipingPracticeForm] = useState(false);
  const [practiceType, setPracticeType] = useState(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState([]);

  const updateWords = async (userId, level, wordId) => {
    try {
      await fetch(`/api/users/${userId}/${level}/${wordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wordId }),
      });
    } catch (error) {
      console.error("Error updating practiced words.", error);
    }
  };

  function newQuestion() {
    setCorrect(null);
    setHint(null);
    if (italianWordInputRef.current !== null) {
      italianWordInputRef.current.value = "";
    }
    provideNewWord();
  }

  function showHint() {
    setHint(`${activeWord.germanWord} = ${activeWord.italianWord}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const number = e.target.elements.numberOfWords.value;
    const favoriteWords = e.target.elements.favoriteWords.checked;
    const level = e.target.elements.wordsLevel.value;
    const practiceType = e.target.elements.practiceType.value;
    setLevel(level);
    setPracticeType(practiceType);
    if ((number < 1 || number > 100) && !favoriteWords) {
      setMessage("Wähle aus, wie viele Wörter du lernen möchtest.");
      return;
    }
    if (status === "authenticated" && level && (number || favoriteWords)) {
      try {
        const userId = session.user.id;
        const response = await fetch(
          `/api/users/${userId}/${level}?favoriteWords=${favoriteWords}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        let { customWords } = await response.json();
        if (favoriteWords) {
          const favoriteWords = customWords.filter(
            (word) => word.isFavorite === true
          );
          if (level !== "all") {
            const favoriteWordsFilteredByLevel = favoriteWords.filter(
              (word) => word.level == level
            );
            customWords = favoriteWordsFilteredByLevel;
          } else {
            customWords = favoriteWords;
          }
          setCustomWords(customWords);
          setPracticeForm(false);
          setPracticeList(true);
        } else {
          if (level !== "all") {
            const wordsFilteredByLevel = customWords.filter(
              (word) => word.level == level
            );
            customWords = wordsFilteredByLevel;
          }
          const shuffledWords = shuffle(customWords);
          const activeWords = shuffledWords.slice(0, number);
          setCustomWords(activeWords);
          setPracticeForm(false);
          setPracticeList(true);
        }
        const shuffledWords = shuffle(customWords);
        const selectedWords = shuffledWords.slice(0, 4);
        const multipleChoiceAnswers = selectedWords.map(
          (word) => word.italianWord
        );

        setMultipleChoiceAnswers(multipleChoiceAnswers);
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    }
  };

  const provideNewWord = () => {
    if (customWords.length > 0) {
      const newWord = customWords[index];
      setActiveWord(newWord);
      const correctAnswer = newWord.italianWord;
      const correctAnswerIndex = multipleChoiceAnswers.indexOf(correctAnswer);
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
      setPracticeList(false);
      setTipingPracticeForm(true);
    } else {
      if (level === "all") {
        setMessage2(`Du hast alle Wörter gelernt.`);
      } else {
        setMessage2(`Du hast alle Wörter auf Level ${level} gelernt.`);
      }
    }
  };

  const reload = () => {
    setPracticeForm(true);
    setPracticeList(false);
    setMessage2("");
    setNumber(0);
  };

  return (
    <main>
      {status === "loading" ? (
        <div className="flex items-center justify-center h-screen">
          <Lottie loop animationData={lottieJson} play />
        </div>
      ) : practiceForm === true ? (
        <PracticeForm
          checked={checked}
          setChecked={setChecked}
          message={message}
          setMessage={setMessage}
          number={number}
          setNumber={setNumber}
          handleSubmit={handleSubmit}
        />
      ) : practiceList === true ? (
        <PracticeList
          level={level}
          number={number}
          favoriteWords={favoriteWords}
          customWords={customWords}
          provideNewWord={provideNewWord}
          reload={reload}
        />
      ) : tipingPracticeForm === true ? (
        <div className="flex flex-col items-center gap-[1.6rem] w-full ">
          {message2 ? (
            <>
              <p>{message2}</p>
              <button
                onClick={reload}
                className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
              >
                Zurück
              </button>
            </>
          ) : practiceType === "typing" ? (
            <TipingPracticeForm
              customWords={customWords}
              setCustomWords={setCustomWords}
              activeWord={activeWord}
              italianWordInputRef={italianWordInputRef}
              correct={correct}
              setCorrect={setCorrect}
              newQuestion={newQuestion}
              updateWords={updateWords}
              level={level}
            >
              <button
                onClick={showHint}
                className="w-full underline flex justify-end pointer-events-auto"
              >
                Lösung anzeigen
              </button>
            </TipingPracticeForm>
          ) : practiceType === "wordsalad" ? (
            <WordSaladPracticeForm
              activeWord={activeWord}
              italianWordInputRef={italianWordInputRef}
              correct={correct}
              setCorrect={setCorrect}
              newQuestion={newQuestion}
              updateWords={updateWords}
              level={level}
              customWords={customWords}
              setCustomWords={setCustomWords}
            />
          ) : practiceType === "multipleChoice" ? (
            <MultipleChoicePracticeForm
              activeWord={activeWord}
              answers={answers}
              setAnswers={setAnswers}
              correct={correct}
              setCorrect={setCorrect}
              newQuestion={newQuestion}
              updateWords={updateWords}
              level={level}
              customWords={customWords}
              setCustomWords={setCustomWords}
            />
          ) : null}
          {hint ? <p className="w-full flex justify-end">{hint}</p> : null}
        </div>
      ) : null}
    </main>
  );
}
