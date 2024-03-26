import { useState } from "react";
import Image from "next/image";

export default function SearchBar({
  customWords,
  setFilteredWords,
  placeholder,
  setSortingDialogue,
  setFilterDialogue,
}) {
  const [searchWord, setSearchWord] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // looks for any matches in either the English or Italian words

  const handleSearch = () => {
    const matchesEnglish = customWords.filter((word) =>
      word.englishWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchesItalian = customWords.filter((word) =>
      word.italianWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchesCombined = [...matchesEnglish, ...matchesItalian];
    if (matchesCombined) {
      setFilteredWords(matchesCombined);
      setSearchWord("");
    }
  };

  /* in addition to clicking the search button
  the search function is also triggered by hitting the Enter key */

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setSortingDialogue(false);
    setFilterDialogue(false);
  };

  return (
    <div className="relative w-[90%]">
      <label htmlFor="searchbar" className="text-[0]">
        search bar
      </label>
      <input
        type="text"
        id="searchbar"
        name="searchbar"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isFocused ? "" : placeholder}
        className="pl-[1.2rem] w-full min-h-[2.4rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none "
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
      />
      <button
        onClick={handleSearch}
        className="absolute top-[50%] -translate-y-1/2 right-[1rem] z-10"
      >
        <Image
          src="/search.svg"
          alt="search button"
          width={80}
          height={80}
          className="w-[1.3rem] h-[1.3rem]"
        ></Image>
      </button>
    </div>
  );
}
