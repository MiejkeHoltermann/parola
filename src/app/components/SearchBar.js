import { useState } from "react";
import Image from "next/image";

export default function SearchBar({
  customWords,
  setFilteredWords,
  placeholder,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = () => {
    const searchMatchesGe = customWords.filter((word) =>
      word.germanWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const searchMatchesIt = customWords.filter((word) =>
      word.italianWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const combinedSearchMatches = [...searchMatchesGe, ...searchMatchesIt];
    if (combinedSearchMatches) {
      setFilteredWords(combinedSearchMatches);
      setSearchWord("");
    }
  };

  const handleChange = (e) => {
    setSearchWord(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-[90%] mt-2">
      <label htmlFor="searchbar" className="text-[0]">
        Search bar
      </label>
      <input
        type="text"
        id="searchbar"
        name="searchbar"
        value={searchWord}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={isFocused ? "" : placeholder}
        className="pl-4 w-full min-h-[2.4rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none "
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        onClick={handleSearch}
        className="absolute top-[50%] -translate-y-1/2 right-3 z-10 cursor-pointer"
      >
        <Image
          src="/search.svg"
          alt="search button"
          width={80}
          height={80}
          className="w-[1.2rem] h-[1.2rem]"
        ></Image>
      </button>
    </div>
  );
}
