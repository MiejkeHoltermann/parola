"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeForm from "../components/Verbpractice/PracticeForm";
import PracticeList from "../components/Verbpractice/PracticeList";
import VerbPractice from "../components/Verbpractice/VerbPractice";
import DefaultButton from "../components/DefaultButton";
import LoadingAnimation from "../components/LoadingAnimation";
import CloseLink from "../components/CloseLink";
import DefaultError from "../components/DefaultError";

export default function Verbpractice() {
  const [practiceStatus, setPracticeStatus] = useState("practice form");
  const [activeVerb, setActiveVerb] = useState(null);
  const [numberOfVerbs, setNumberOfVerbs] = useState(1);
  const [customVerbs, setCustomVerbs] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [hint, setHint] = useState(false);
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

  // if a user fills out all input fields for a verb correctly, a new verb is loaded

  const newQuestion = async (e) => {
    e.preventDefault();
    const verbId = activeVerb._id;
    setCorrect(false);
    setHint(false);
    setError2("");
    setVerbData({
      presente01: "",
      presente02: "",
      presente03: "",
      presente04: "",
      presente05: "",
      presente06: "",
    });
    provideNewVerb(verbId);
  };

  // after the user gave a correct answer the next verb is provided

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

  // in case the user choses criteria which match none of their verbs they can reload the page and try again

  const reload = () => {
    setPracticeStatus("practice form");
    setNumberOfVerbs(1);
  };

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
                numberOfVerbs={numberOfVerbs}
                setNumberOfVerbs={setNumberOfVerbs}
                error={error}
                setError={setError}
                error2={error2}
                setError2={setError2}
                setCustomVerbs={setCustomVerbs}
                setPracticeStatus={setPracticeStatus}
              />
            ) : practiceStatus === "practice list" ? (
              <PracticeList
                customVerbs={customVerbs}
                provideNewVerb={provideNewVerb}
                reload={reload}
              />
            ) : practiceStatus === "practice" ? (
              <div className="flex flex-col items-center gap-[1.6rem] w-full ">
                {customVerbs.length === 0 ? (
                  <>
                    <p className="text-center mt-[2rem]">
                      You have practiced all verbs.
                    </p>
                    <DefaultButton
                      buttonFunction={() => router.push("/home")}
                      buttonType="button"
                      buttonText="Close"
                    />
                  </>
                ) : (
                  <VerbPractice
                    activeVerb={activeVerb}
                    verbData={verbData}
                    setVerbData={setVerbData}
                    correct={correct}
                    setCorrect={setCorrect}
                    error2={error2}
                    setError2={setError2}
                    hint={hint}
                    setHint={setHint}
                    newQuestion={newQuestion}
                    loading={loading}
                  />
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
