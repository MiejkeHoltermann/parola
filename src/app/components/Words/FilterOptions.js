import { Fragment } from "react";
import DefaultButton from "../DefaultButton";

export default function FilterOptions({
  customWords,
  setFilteredWords,
  filterDialogue,
  setFilterDialogue,
  setSortingDialogue,
  selectedLevel,
  setSelectedLevel,
  resetFilters,
}) {
  const handleFilterDialogue = () => {
    setFilterDialogue(!filterDialogue);
    setSortingDialogue(false);
  };

  // filters all words for the ones marked as favorite or the words of a certain level

  const filterWords = () => {
    let filteredWords;
    if (selectedLevel === "favorites") {
      filteredWords = customWords.filter((word) => word.isFavorite);
    } else if (selectedLevel.startsWith("level")) {
      const level = parseInt(selectedLevel.slice(-1));
      filteredWords = customWords.filter((word) => word.level === level);
    } else if (selectedLevel === "all") {
      setFilterDialogue(false);
      return;
    }
    setFilteredWords(filteredWords);
    setFilterDialogue(false);
  };

  const handleCheckboxChange = (e) => {
    const { id } = e.target;
    setSelectedLevel(id === selectedLevel ? null : id);
  };

  return (
    <>
      <button
        onClick={handleFilterDialogue}
        type="button"
        className="text-left w-[4rem]"
      >
        Filter
      </button>
      {filterDialogue && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              filterWords();
            }}
            className="w-full mt-[1rem] border-2 border-mint rounded-lg p-[1rem]"
          >
            <div className="w-full flex items-center gap-[0.5rem]">
              <input
                type="checkbox"
                id="favorites"
                checked={selectedLevel === "favorites"}
                onChange={handleCheckboxChange}
                className="accent-mint w-[1.4rem] h-[1.4rem]"
              />
              <label htmlFor="favorites">nur Favoriten</label>
            </div>
            <p className="mt-[1rem] mb-[0.3rem]">Levels</p>
            <div className="flex items-center gap-[0.5rem]">
              {[1, 2, 3, 4, 5].map((level) => (
                <Fragment key={level}>
                  <input
                    type="checkbox"
                    id={`level${level}`}
                    checked={selectedLevel === `level${level}`}
                    onChange={handleCheckboxChange}
                    className="accent-mint w-[1.4rem] h-[1.4rem]"
                  />
                  <label htmlFor={`level${level}`}>{level}</label>
                </Fragment>
              ))}
            </div>
            <div className="flex justify-between items-end">
              <button
                onClick={() => resetFilters()}
                type="button"
                className="underline mb-[0.2rem]"
              >
                Zurücksetzen
              </button>
              <DefaultButton buttonType="submit" buttonText="OK" size="4rem" />
            </div>
          </form>
        </>
      )}
    </>
  );
}
