import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "fast-shuffle";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import DefaultCheckbox from "../../components/DefaultCheckbox";
import SelectLevelInput from "../../components/Wordpractice/SelectLevelInput";
import SelectPracticeTypeInput from "../../components/Wordpractice/SelectPracticeTypeInput";

export default function PracticeForm({
  numberOfWords,
  setNumberOfWords,
  error,
  setError,
  level,
  setLevel,
  practiceType,
  setPracticeType,
  setCustomWords,
  setPracticeStatus,
  setMultipleChoiceAnswers,
}) {
  const [checked, setChecked] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [wordsLevels, setWordsLevels] = useState(Array(6).fill(0));
  const [options, setOptions] = useState(Array(6).fill(""));
  const [defaultOption, setDefaultOption] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const {
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
            customWords,
          } = await response.json();
          setWordsLevels([
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
            customWords,
          ]);
          setDefaultOption(`Alle (${customWords} Wörter)`);
          setOptions([
            `Level 1 (${wordsLevel1} Wörter)`,
            `Level 2 (${wordsLevel2} Wörter)`,
            `Level 3 (${wordsLevel3} Wörter)`,
            `Level 4 (${wordsLevel4} Wörter)`,
            `Level 5 (${wordsLevel5} Wörter)`,
            `Alle (${customWords} Wörter)`,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [session]);

  const handleNumberChange = (e) => {
    let numberOfWords = parseInt(e.target.value, 10);
    setChecked(false);
    setNumberOfWords(numberOfWords);
    if (numberOfWords < 1 || numberOfWords > 100) {
      setInvalid(true);
      setError("Wähle zwischen 1 und 100 Wörtern für diese Lerneinheit aus.");
    } else {
      setInvalid(false);
      setError("");
    }
  };

  const handleFavoritesChange = (e) => {
    const { checked } = e.target;
    if (checked === true) {
      setNumberOfWords(0);
      setInvalid(false);
      setError("");
    }
    setChecked(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numberOfWords = e.target.elements.numberOfWords.value;
    const favoriteWords = e.target.elements.favoriteWords.checked;
    if ((numberOfWords < 1 || numberOfWords > 100) && !favoriteWords) {
      setError(
        "Wähle zwischen 1 und 100 Wörtern für diese Lerneinheit aus oder setze ein Häkchen bei den Favoriten."
      );
      return;
    }
    if (status === "authenticated") {
      try {
        const userId = session.user.id;
        const response = await fetch(`/api/users/${userId}/words`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let { customWords } = await response.json();
        if (favoriteWords) {
          const favoriteWords = customWords.filter(
            (word) => word.isFavorite === true
          );
          if (level !== 6) {
            const favoriteWordsFilteredByLevel = favoriteWords.filter(
              (word) => word.level == level
            );
            customWords = favoriteWordsFilteredByLevel;
          } else {
            customWords = favoriteWords;
          }
          setCustomWords(customWords);
          setPracticeStatus("practice list");
        } else {
          if (level !== 6) {
            const wordsFilteredByLevel = customWords.filter(
              (word) => word.level == level
            );
            customWords = wordsFilteredByLevel;
          }
          const shuffledWords = shuffle(customWords);
          const activeWords = shuffledWords.slice(0, numberOfWords);
          setCustomWords(activeWords);
          setPracticeStatus("practice list");
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

  return (
    <>
      {defaultOption && (
        <form
          onSubmit={handleSubmit}
          className="w-[90%] flex flex-col items-center mt-[1rem] gap-[0.6rem]"
        >
          <label htmlFor="numberOfWords" className="text-center">
            Wie viele Wörter möchtest du heute lernen?
          </label>
          <input
            type="number"
            id="numberOfWords"
            name="numberOfWords"
            value={numberOfWords}
            onChange={handleNumberChange}
            className={`w-[6rem] h-[2.2rem] pl-[1.2rem] pr-[0.4rem] mb-[1rem] focus:outline-none border border-gray-300 rounded-md ${
              invalid ? "text-red-500" : ""
            }`}
          />
          <p>Wähle ein Level aus</p>
          <SelectLevelInput
            setLevel={setLevel}
            defaultOption={defaultOption}
            setDefaultOption={setDefaultOption}
            options={options}
            wordsLevels={wordsLevels}
          />
          <DefaultCheckbox
            onChange={handleFavoritesChange}
            checked={checked}
            checkboxId="favoriteWords"
            checkboxName="favoriteWords"
            checkboxValue="favoriteWords"
            checkboxLabel="nur Favoriten"
          />
          <p className="text-center mt-[1rem]">
            Wie möchtest du abgefragt werden?
          </p>
          <SelectPracticeTypeInput
            practiceType={practiceType}
            setPracticeType={setPracticeType}
          />
          {error && <DefaultError errorMessage={error} />}
          <DefaultButton buttonType="submit" buttonText="Los geht's" />
        </form>
      )}
    </>
  );
}
