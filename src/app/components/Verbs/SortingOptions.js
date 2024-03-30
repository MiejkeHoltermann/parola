import Image from "next/image";

export default function SortingOptions({
  customVerbs,
  filteredVerbs,
  setFilteredVerbs,
  sortingDialogue,
  setSortingDialogue,
  setFilterDialogue,
}) {
  const handleDialogue = () => {
    setSortingDialogue(!sortingDialogue);
    setFilterDialogue(false);
  };

  // sorts all verbs alphabetically either in ascending or descending order

  const sortVerbs = (order) => {
    const sortedVerbs = filteredVerbs ? [...filteredVerbs] : [...customVerbs];
    sortedVerbs.sort((a, b) => {
      const wordA = a.name.toLowerCase();
      const wordB = b.name.toLowerCase();
      if (order === "asc") {
        return wordA.localeCompare(wordB);
      } else if (order === "desc") {
        return wordB.localeCompare(wordA);
      }
      return 0;
    });
    setFilteredVerbs(sortedVerbs);
    setSortingDialogue(false);
  };

  return (
    <>
      <button
        onClick={handleDialogue}
        type="button"
        className="absolute top-0 right-0 flex justify-end items-center gap-[0.5rem]"
      >
        <p>Sort</p>
        <Image
          src="/arrow.svg"
          alt="arrow"
          width={100}
          height={100}
          className="w-[1rem] h-[1rem] flex justify-center items-center"
        />
      </button>
      {sortingDialogue && (
        <div className="absolute top-[2.2rem] right-[-0.2rem] z-10 border-2 border-mint bg-white rounded-lg">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <button
              onClick={() => sortVerbs("asc")}
              className="block px-[1rem] py-[0.5rem] hover:bg-superlightblue"
            >
              A - Z
            </button>
            <button
              onClick={() => sortVerbs("desc")}
              className="block px-[1rem] py-[0.5rem] hover:bg-superlightblue"
            >
              Z - A
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
