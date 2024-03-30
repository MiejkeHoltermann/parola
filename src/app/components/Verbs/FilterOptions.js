import { useState } from "react";
import Image from "next/image";
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
        className="flex justify-end items-center gap-[0.5rem]"
      >
        <p>Filter</p>
        <Image
          src="/arrow.svg"
          alt="arrow"
          width={100}
          height={100}
          className="w-[1rem] h-[1rem] flex justify-center items-center"
        />
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
              <label htmlFor="favorites">Favorites only</label>
            </div>
            <div className="flex justify-between items-end">
              <button
                onClick={() => resetFilters()}
                type="button"
                className="underline mb-[0.2rem] hover:text-mint"
              >
                Reset
              </button>
              <DefaultButton buttonType="submit" buttonText="OK" size="4rem" />
            </div>
          </form>
        </>
      )}
    </>
  );
}
