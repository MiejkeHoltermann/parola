import { useState } from "react";
import Image from "next/image";

export default function SearchBar({
  customVerbs,
  setFilteredVerbs,
  placeholder,
  setSortingDialogue,
  setFilterDialogue,
}) {
  const [searchWord, setSearchWord] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // looks for any matches

  const handleSearch = () => {
    const matches = customVerbs.filter((verb) => {
      if (verb.name.toLowerCase().includes(searchWord.toLowerCase())) {
        return true;
      }
      if (verb.presente) {
        for (let i = 1; i <= 6; i++) {
          const key = `presente0${i}`;
          if (
            verb.presente[key].toLowerCase().includes(searchWord.toLowerCase())
          ) {
            return true;
          }
        }
      }
      return false;
    });
    if (matches) {
      setFilteredVerbs(matches);
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
