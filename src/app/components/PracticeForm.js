import Checkbox from "../components/Checkbox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PracticeForm({
  message,
  setMessage,
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
        setMessage("Wähle eine Zahl zwischen 1 und 100.");
      } else {
        setInvalid(false);
        setMessage("");
      }
    }
  };

  const handleFavoritesChange = (e) => {
    const { checked } = e.target;
    if (checked === true) {
      setNumber(0);
      setInvalid(false);
      setMessage("");
    }
    setChecked(checked);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[90%] flex flex-col items-center p-4 gap-6"
    >
      <label htmlFor="numberOfWords">
        Wie viele Wörter möchtest du heute lernen? (1 - 100)
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
      <Checkbox
        checkboxId="favoriteWords"
        checkboxName="favoriteWords"
        checkboxValue="favoriteWords"
        checkboxLabel="Alle Favoriten lernen"
        onChange={handleFavoritesChange}
        favorite={checked}
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
      {message ? <p className="font-bold text-red-500">{message}</p> : null}
      <button
        type="submit"
        className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        Los geht's
      </button>
    </form>
  );
}
