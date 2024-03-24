import { useSession } from "next-auth/react";
import { useState } from "react";
import { shuffle } from "fast-shuffle";
import DefaultError from "../DefaultError";
import DefaultButton from "../DefaultButton";
import DefaultCheckbox from "../../components/DefaultCheckbox";
import SelectLevelInput from "../../components/Wordpractice/SelectLevelInput";
import SelectPracticeTypeInput from "../../components/Wordpractice/SelectPracticeTypeInput";

// enables the user to make some selections about which or how many words they want to practice

export default function PracticeForm({
  numberOfWords,
  setNumberOfWords,
  setError,
  error2,
  setError2,
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
  const [defaultOption, setDefaultOption] = useState();

  const { data: session } = useSession();

  const handleNumberChange = (e) => {
    let numberOfWords = parseInt(e.target.value, 10);
    setChecked(false);
    setNumberOfWords(numberOfWords);
    if (numberOfWords < 1 || numberOfWords > 100) {
      setInvalid(true);
      setError2(
        "Wähle zwischen 1 und 100 Wörtern für diese Lerneinheit aus oder setze ein Häkchen bei den Favoriten."
      );
    } else {
      setInvalid(false);
      setError2("");
    }
  };

  const handleFavoritesChange = (e) => {
    const { checked } = e.target;
    if (checked === true) {
      setNumberOfWords(0);
      setInvalid(false);
      setError2("");
    }
    setChecked(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // checks whether the input fields for numberOfWords and favorites are valid
    // the input fields for level and practice type are set to a default value in case the user doesn't make a choice
    const numberOfWords = e.target.elements.numberOfWords.value;
    const favoriteWords = e.target.elements.favoriteWords.checked;
    if ((numberOfWords < 1 || numberOfWords > 100) && !favoriteWords) {
      setError2(
        "Wähle zwischen 1 und 100 Wörtern für diese Lerneinheit aus oder setze ein Häkchen bei den Favoriten."
      );
      return;
    } else if (session) {
      const userId = session.user.id;
      // fetches all words
      try {
        const response = await fetch(`/api/users/${userId}/words`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let { customWords } = await response.json();
        // the user can either filter for favorites or choose a specific number of words they want to practice
        if (customWords) {
          // filters for favorite words
          if (favoriteWords) {
            const favoriteWords = customWords.filter(
              (word) => word.isFavorite === true
            );
            // additionally filters for a specific level (level 6 means "all levels" and is the default option)
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
            // filters for a specific level (level 6 means "all levels" and is the default option)
            if (level !== 6) {
              const wordsFilteredByLevel = customWords.filter(
                (word) => word.level == level
              );
              customWords = wordsFilteredByLevel;
            }
            // limits the words to the number of words that the user picked
            const shuffledWords = shuffle(customWords);
            const activeWords = shuffledWords.slice(0, numberOfWords);
            setCustomWords(activeWords);
            setPracticeStatus("practice list");
          }
          // choses 4 random words to use for the multiple choice answers
          const shuffledWords = shuffle(customWords);
          const selectedWords = shuffledWords.slice(0, 4);
          const multipleChoiceAnswers = selectedWords.map(
            (word) => word.italianWord
          );
          setMultipleChoiceAnswers(multipleChoiceAnswers);
        } else {
          setError("Error retrieving words");
        }
      } catch (error) {
        setError("Error retrieving words");
      }
    }
  };

  return (
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
        setError={setError}
      />
      <DefaultCheckbox
        onChange={handleFavoritesChange}
        checked={checked}
        checkboxId="favoriteWords"
        checkboxName="favoriteWords"
        checkboxValue="favoriteWords"
        checkboxLabel="nur Favoriten"
      />
      <p className="text-center mt-[1rem]">Wie möchtest du abgefragt werden?</p>
      <SelectPracticeTypeInput
        practiceType={practiceType}
        setPracticeType={setPracticeType}
      />
      {error2 && <DefaultError errorMessage={error2} />}
      <DefaultButton buttonType="submit" buttonText="Los geht's" size="8rem" />
    </form>
  );
}
