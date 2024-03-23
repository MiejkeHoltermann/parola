import Image from "next/image";

export default function SortingOptions({
  customWords,
  filteredWords,
  setFilteredWords,
  sortingDialogue,
  setSortingDialogue,
  setFilterDialogue,
}) {
  const handleDialogue = () => {
    setSortingDialogue(!sortingDialogue);
    setFilterDialogue(false);
  };

  const sortWords = (sortBy, order) => {
    const sortedWords = filteredWords ? [...filteredWords] : [...customWords];
    sortedWords.sort((a, b) => {
      if (sortBy === "alphabet") {
        const wordA = a.germanWord.toLowerCase();
        const wordB = b.germanWord.toLowerCase();
        if (order === "asc") {
          return wordA.localeCompare(wordB);
        } else if (order === "desc") {
          return wordB.localeCompare(wordA);
        }
      } else if (sortBy === "level") {
        const levelA = a.level;
        const levelB = b.level;
        if (order === "asc") {
          return levelA - levelB;
        } else if (order === "desc") {
          return levelB - levelA;
        }
      }
      return 0;
    });
    setFilteredWords(sortedWords);
  };

  return (
    <>
      <button
        onClick={handleDialogue}
        type="button"
        className="absolute top-0 right-0 flex justify-end items-center gap-[0.5rem]"
      >
        <p>Sortieren</p>
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
              onClick={() => sortWords("alphabet", "asc")}
              className="block px-[1rem] py-[0.5rem]"
            >
              Alphabet A - Z
            </button>
            <button
              onClick={() => sortWords("alphabet", "desc")}
              className="block px-[1rem] py-[0.5rem]"
            >
              Alphabet Z - A
            </button>
            <button
              onClick={() => sortWords("level", "asc")}
              className="block px-[1rem] py-[0.5rem]"
            >
              Level 1 - 5
            </button>
            <button
              onClick={() => sortWords("level", "desc")}
              className="block px-[1rem] py-[0.5rem]"
            >
              Level 5 - 1
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
