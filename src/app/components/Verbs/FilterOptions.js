import DefaultButton from "../DefaultButton";

export default function FilterOptions({
  customVerbs,
  setFilteredVerbs,
  filterDialogue,
  setFilterDialogue,
  setSortingDialogue,
  resetFilters,
}) {
  const handleFilterDialogue = () => {
    setFilterDialogue(!filterDialogue);
    setSortingDialogue(false);
  };

  const filterVerbs = (e) => {
    e.preventDefault();
    let filteredVerbs = [];
    if (e.target.elements.favorites.checked) {
      filteredVerbs = customVerbs.filter((verb) => verb.isFavorite);
    }
    setFilteredVerbs(filteredVerbs);
    setFilterDialogue(false);
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
              <DefaultButton
                buttonType="submit"
                buttonText="OK"
                smallSize="4rem"
              />
            </div>
          </form>
        </>
      )}
    </>
  );
}
