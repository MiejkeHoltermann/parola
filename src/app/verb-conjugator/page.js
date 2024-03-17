"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import VerbInputField from "../components/VerbInputField";
import { useRouter } from "next/navigation";
import DefaultButton from "../components/DefaultButton";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";
import VerbForm from "../components/VerbForm";
import VerbList from "../components/VerbList";
import { shuffle } from "fast-shuffle";
import VerbPractice from "../components/VerbPractice";

export default function VerbConjugator() {
  const { data: session, status } = useSession();
  const [activeVerb, setActiveVerb] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [presenteValues, setPresenteValues] = useState(Array(6).fill(""));
  const userId = session?.user?.id;
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const router = useRouter();
  const [verbForm, setVerbForm] = useState(true);
  const [verbList, setVerbList] = useState(false);
  const [verbPractice, setVerbPractice] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(0);
  const [timeform, setTimeform] = useState("");
  const [customVerbs, setCustomVerbs] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [alert, setAlert] = useState("");

  const newQuestion = () => {
    console.log("test new");
    setCorrect(null);
    setActiveVerb(null);
    setPresenteValues(Array(6).fill(""));
    setAnswers(Array(6).fill(null));
    provideNewVerb();
    setError("");
  };

  const presenteLabels = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numberOfVerbs = e.target.elements.numberOfVerbs.value;
    const verbsTimeform = e.target.elements.verbsTimeform.value;
    setNumber(numberOfVerbs);
    setTimeform(verbsTimeform);
    if (number < 1 || number > 10) {
      setError("Wähle zwischen 1 und 10 Verben für diese Lerneinheit aus.");
      return;
    }
    if (status === "authenticated" && number && timeform) {
      try {
        const userId = session.user.id;
        const response = await fetch(`/api/users/${userId}/verbs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let { customVerbs } = await response.json();
        const shuffledVerbs = shuffle(customVerbs);
        const activeVerbs = shuffledVerbs.slice(0, number);
        setCustomVerbs(activeVerbs);
        setVerbForm(false);
        setVerbList(true);
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    }
  };

  const provideNewVerb = () => {
    console.log("test", customVerbs.length);
    if (customVerbs.length > 0) {
      const newVerb = customVerbs[index];
      setActiveVerb(newVerb);
      setVerbList(false);
      setVerbPractice(true);
    } else {
      setAlert(`Du hast alle Verben gelernt.`);
    }
  };

  const reload = () => {
    setVerbForm(true);
    setVerbList(false);
    setAlert("");
    setNumber(0);
  };

  return (
    <main>
      {status === "loading" ? (
        <div className="flex items-center justify-center h-screen">
          <Lottie loop animationData={lottieJson} play />
        </div>
      ) : verbForm === true ? (
        <VerbForm
          error={error}
          setError={setError}
          number={number}
          setNumber={setNumber}
          handleSubmit={handleSubmit}
        />
      ) : verbList === true ? (
        <VerbList
          provideNewVerb={provideNewVerb}
          customVerbs={customVerbs}
          reload={reload}
        />
      ) : verbPractice === true ? (
        <>
          {alert ? (
            <>
              <p className="text-center">{alert}</p>
              <DefaultButton
                buttonFunction={reload}
                buttonType="button"
                buttonText="Zurück"
              />
            </>
          ) : (
            <VerbPractice
              customVerbs={customVerbs}
              setCustomVerbs={setCustomVerbs}
              activeVerb={activeVerb}
              setActiveVerb={setActiveVerb}
              answers={answers}
              setAnswers={setAnswers}
              newQuestion={newQuestion}
              correct={correct}
              setCorrect={setCorrect}
              error={error}
              setError={setError}
              number={number}
              timeform={timeform}
            />
          )}
        </>
      ) : null}
    </main>
  );
}
