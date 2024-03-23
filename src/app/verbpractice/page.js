"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VerbPracticeForm from "../components/Verbpractice/VerbPracticeForm";
import VerbPracticeList from "../components/Verbpractice/VerbPracticeList";
import VerbPractice from "../components/Verbpractice/VerbPractice";
import DefaultButton from "../components/DefaultButton";
import LoadingAnimation from "../components/LoadingAnimation";
import CloseLink from "../components/CloseLink";

export default function Verbpractice() {
  const [practiceStatus, setPracticeStatus] = useState("practice form");
  const [activeVerb, setActiveVerb] = useState(null);
  const [numberOfVerbs, setNumberOfVerbs] = useState(1);
  const [customVerbs, setCustomVerbs] = useState([]);
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [correct, setCorrect] = useState(false);
  const [presenteValues, setPresenteValues] = useState(Array(6).fill(""));
  const [isCorrect, setIsCorrect] = useState(Array(6).fill(null));
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [verbData, setVerbData] = useState({
    presente01: "",
    presente02: "",
    presente03: "",
    presente04: "",
    presente05: "",
    presente06: "",
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  const newQuestion = async (e) => {
    e.preventDefault();
    const verbId = activeVerb._id;
    setCorrect(false);
    setHint(false);
    setError("");
    setVerbData({
      presente01: "",
      presente02: "",
      presente03: "",
      presente04: "",
      presente05: "",
      presente06: "",
    });
    setLoading(false);
    provideNewVerb(verbId);
  };

  const provideNewVerb = (verbId) => {
    setCustomVerbs((prevCustomVerbs) => {
      const newCustomVerbs = prevCustomVerbs.filter(
        (verb) => verb._id !== verbId
      );
      if (newCustomVerbs.length > 0) {
        const newVerb = newCustomVerbs[index];
        setActiveVerb(newVerb);
        setPracticeStatus("practice");
      }
      return newCustomVerbs;
    });
  };

  const reload = () => {
    setPracticeStatus("practice form");
    setNumberOfVerbs(1);
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : (
        <>
          <CloseLink href="/home" />
          {practiceStatus === "practice form" ? (
            <VerbPracticeForm
              numberOfVerbs={numberOfVerbs}
              setNumberOfVerbs={setNumberOfVerbs}
              error={error}
              setError={setError}
              setCustomVerbs={setCustomVerbs}
              setPracticeStatus={setPracticeStatus}
            />
          ) : practiceStatus === "practice list" ? (
            <VerbPracticeList
              customVerbs={customVerbs}
              provideNewVerb={provideNewVerb}
              reload={reload}
            />
          ) : practiceStatus === "practice" ? (
            <div className="flex flex-col items-center gap-[1.6rem] w-full ">
              {customVerbs.length === 0 ? (
                <>
                  <p className="text-center mt-[2rem]">
                    Du hast alle Verben gelernt.
                  </p>
                  <DefaultButton
                    buttonFunction={() => router.push("/home")}
                    buttonType="button"
                    buttonText="Schließen"
                  />
                </>
              ) : (
                <VerbPractice
                  activeVerb={activeVerb}
                  verbData={verbData}
                  setVerbData={setVerbData}
                  correct={correct}
                  setCorrect={setCorrect}
                  error={error}
                  setError={setError}
                  answers={answers}
                  setAnswers={setAnswers}
                  hint={hint}
                  setHint={setHint}
                  loading={loading}
                  newQuestion={newQuestion}
                />
              )}
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
