import DefaultCheckbox from "../components/DefaultCheckbox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DefaultError from "./DefaultError";
import DefaultButton from "./DefaultButton";

export default function VerbForm({
  error,
  setError,
  number,
  setNumber,
  handleSubmit,
}) {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(false);
  const [allWords, setAllWords] = useState(null);
  const [wordsLevels, setWordsLevels] = useState(Array(5).fill(0));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const {
            customWords,
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
          } = await response.json();
          setAllWords(customWords.length);
          setWordsLevels([
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [session]);

  const handleNumberChange = (e) => {
    let number = parseInt(e.target.value, 10);
    if (checked === true) {
      setChecked(false);
    } else {
      setNumber(number);
      if (number < 1 || number > 10) {
        setInvalid(true);
        setError("Wähle zwischen 1 und 10 Verben für diese Lerneinheit aus.");
      } else {
        setInvalid(false);
        setError("");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[90%] flex flex-col items-center p-4 gap-6"
    >
      <label htmlFor="numberOfVerbs" className="text-center">
        Wie viele Verben möchtest du heute lernen?
      </label>
      <input
        type="number"
        id="numberOfVerbs"
        name="numberOfVerbs"
        value={number}
        onChange={handleNumberChange}
        className={`w-[40%] focus:outline-none focus:outline-[1px] focus:outline-gray-300 focus:p-1 focus:rounded-md ${
          invalid ? "text-red-500" : ""
        }`}
      />
      <label htmlFor="verbsTimeform" className="text-center">
        Welche Zeitformen möchtest du lernen?
      </label>
      <select id="verbsTimeform" name="verbsTimeform">
        <option value="presente">Presente</option>
        <option value="imperfetto">Imperfetto</option>
      </select>
      {error && <DefaultError errorMessage={error} />}
      <DefaultButton buttonType="submit" buttonText="Los geht's" />
    </form>
  );
}
