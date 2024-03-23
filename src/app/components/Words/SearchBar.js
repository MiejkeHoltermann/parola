import { useState } from "react";
import Image from "next/image";

export default function SearchBar({
  customWords,
  setFilteredWords,
  placeholder,
}) {
  const [searchWord, setSearchWord] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    const matchesGerman = customWords.filter((word) =>
      word.germanWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchesItalian = customWords.filter((word) =>
      word.italianWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchesCombined = [...matchesGerman, ...matchesItalian];
    if (matchesCombined) {
      setFilteredWords(matchesCombined);
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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={isFocused ? "" : placeholder}
        className="pl-[1.2rem] w-full min-h-[2.4rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none "
        onFocus={handleFocus}
        onBlur={handleBlur}
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
