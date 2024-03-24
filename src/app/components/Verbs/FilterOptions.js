import { useState } from "react";
import DefaultButton from "../DefaultButton";

export default function FilterOptions({
  customVerbs,
  setFilteredVerbs,
  filterDialogue,
  setFilterDialogue,
  setSortingDialogue,
  resetFilters,
}) {
  const [checked, setChecked] = useState(false);

  const handleFilterDialogue = () => {
    setFilterDialogue(!filterDialogue);
    setSortingDialogue(false);
  };

  // filters all verbs for the ones marked as favorite

  const filterVerbs = (e) => {
    e.preventDefault();
    let filteredVerbs = [];
    if (e.target.elements.favorites.checked) {
      filteredVerbs = customVerbs.filter((verb) => verb.isFavorite);
      setFilteredVerbs(filteredVerbs);
    } else {
      setFilteredVerbs(customVerbs);
    }
    setFilterDialogue(false);
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
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
              filterVerbs(e);
            }}
            className="w-full mt-[1rem] border-2 border-mint rounded-lg p-[1rem]"
          >
            <div className="w-full flex items-center gap-[0.5rem]">
              <input
                type="checkbox"
                id="favorites"
                checked={checked}
                onChange={handleCheckboxChange}
                className="accent-mint w-[1.4rem] h-[1.4rem]"
              />
              <label htmlFor="favorites">nur Favoriten</label>
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
