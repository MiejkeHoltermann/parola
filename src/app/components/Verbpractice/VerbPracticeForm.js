import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "fast-shuffle";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";

export default function VerbPracticeForm({
  numberOfVerbs,
  setNumberOfVerbs,
  error,
  setError,
  setCustomVerbs,
  setPracticeStatus,
}) {
  const [checked, setChecked] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const { customWords } = await response.json();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [session]);

  const handleNumberChange = (e) => {
    let numberOfVerbs = parseInt(e.target.value, 10);
    setChecked(false);
    setNumberOfVerbs(numberOfVerbs);
    if (numberOfVerbs < 1 || numberOfVerbs > 20) {
      setInvalid(true);
      setError("Wähle zwischen 1 und 20 Verben für diese Lerneinheit aus.");
    } else {
      setInvalid(false);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numberOfVerbs = e.target.elements.numberOfVerbs.value;
    setNumberOfVerbs(numberOfVerbs);
    if (numberOfVerbs < 1 || numberOfVerbs > 20) {
      setError("Wähle zwischen 1 und 20 Verben für diese Lerneinheit aus.");
      return;
    }
    if (status === "authenticated") {
      try {
        const userId = session.user.id;
        const response = await fetch(`/api/users/${userId}/verbs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let { customVerbs } = await response.json();
        const shuffledVerbs = shuffle(customVerbs);
        const activeVerbs = shuffledVerbs.slice(0, numberOfVerbs);
        setCustomVerbs(activeVerbs);
        setPracticeStatus("practice list");
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90%] flex flex-col items-center mt-[1rem] gap-[0.6rem]"
    >
      <label htmlFor="numberOfVerbs" className="text-center">
        Wie viele Verben möchtest du heute lernen?
      </label>
      <input
        type="number"
        id="numberOfVerbs"
        name="numberOfVerbs"
        value={numberOfVerbs}
        onChange={handleNumberChange}
        className={`w-[6rem] h-[2.2rem] pl-[1.2rem] pr-[0.4rem] mb-[1rem] focus:outline-none border border-gray-300 rounded-md ${
          invalid ? "text-red-500" : ""
        }`}
      />
      {error && <DefaultError errorMessage={error} />}
      <DefaultButton buttonType="submit" buttonText="Los geht's" />
    </form>
  );
}
