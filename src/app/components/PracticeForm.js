import DefaultCheckbox from "../components/DefaultCheckbox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DefaultError from "./DefaultError";
import DefaultButton from "./DefaultButton";

export default function PracticeForm({
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
      if (number < 1 || number > 100) {
        setInvalid(true);
        setError("Wähle zwischen 1 und 100 Wörtern für diese Lerneinheit aus.");
      } else {
        setInvalid(false);
        setError("");
      }
    }
  };

  const handleFavoritesChange = (e) => {
    const { checked } = e.target;
    if (checked === true) {
      setNumber(0);
      setInvalid(false);
      setError("");
    }
    setChecked(checked);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[90%] flex flex-col items-center p-4 gap-6"
    >
      <label htmlFor="numberOfWords" className="text-center">
        Wie viele Wörter möchtest du heute lernen?
      </label>
      <input
        type="number"
        id="numberOfWords"
        name="numberOfWords"
        value={number}
        onChange={handleNumberChange}
        className={`w-[40%] focus:outline-none focus:outline-[1px] focus:outline-gray-300 focus:p-1 focus:rounded-md ${
          invalid ? "text-red-500" : ""
        }`}
      />
      <DefaultCheckbox
        checkboxId="favoriteWords"
        checkboxName="favoriteWords"
        checkboxValue="favoriteWords"
        checkboxLabel="Alle Favoriten lernen"
        onChange={handleFavoritesChange}
        checked={checked}
      />
      <label htmlFor="wordsLevel" className="text-center">
        Wähle ein Level aus
      </label>
      <select id="wordsLevel" name="wordsLevel">
        <option value="all">Alle ({allWords} Wörter)</option>
        {wordsLevels.map((count, index) => (
          <option key={index + 1} value={index + 1}>
            Level {index + 1} ({count} Wörter)
          </option>
        ))}
      </select>
      <label htmlFor="practiceType" className="text-center">
        Wie möchtest du abgefragt werden?
      </label>
      <select id="practiceType" name="practiceType">
        <option value="typing">Eintippen</option>
        <option value="wordsalad">Wortsalat</option> 
        <option value="multipleChoice">Multiple Choice</option>
      </select>
      {error && <DefaultError errorMessage={error} />}
      <DefaultButton buttonType="submit" buttonText="Los geht's" />
    </form>
  );
}
