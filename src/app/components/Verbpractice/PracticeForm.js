import { useSession } from "next-auth/react";
import { useState } from "react";
import { shuffle } from "fast-shuffle";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";

// enables the user to select how many verbs they want to practice

export default function PracticeForm({
  numberOfVerbs,
  setNumberOfVerbs,
  setError,
  error2,
  setError2,
  setCustomVerbs,
  setPracticeStatus,
}) {
  const [invalid, setInvalid] = useState(false);

  const { data: session } = useSession();

  const handleNumberChange = (e) => {
    let numberOfVerbs = parseInt(e.target.value, 10);
    setNumberOfVerbs(numberOfVerbs);
    if (numberOfVerbs < 1 || numberOfVerbs > 10) {
      setInvalid(true);
      setError2("Pick between 1 and 10 verbs.");
    } else {
      setInvalid(false);
      setError2("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // checks whether the input field for numberOfVerbs is valid
    const numberOfVerbs = e.target.elements.numberOfVerbs.value;
    if (numberOfVerbs < 1 || numberOfVerbs > 10) {
      setError2("Pick between 1 and 10 verbs.");
      return;
    } else if (session) {
      const userId = session.user.id;
      // fetches all verbs
      try {
        const response = await fetch(`/api/users/${userId}/verbs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { customVerbs } = await response.json();
        // limits the verbs to the number of verbs that the user picked
        if (customVerbs) {
          const shuffledVerbs = shuffle(customVerbs);
          const activeVerbs = shuffledVerbs.slice(0, numberOfVerbs);
          setCustomVerbs(activeVerbs);
          setPracticeStatus("practice list");
        } else {
          setError("Error retrieving verbs");
        }
      } catch (error) {
        setError("Error retrieving verbs");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90%] flex flex-col items-center mt-[1rem] gap-[0.6rem]"
    >
      <label htmlFor="numberOfVerbs" className="text-center">
        How many verbs do you want to practice?
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
      {error2 && <DefaultError errorMessage={error2} />}
      <DefaultButton buttonType="submit" buttonText="Let's go" size="8rem" />
    </form>
  );
}
