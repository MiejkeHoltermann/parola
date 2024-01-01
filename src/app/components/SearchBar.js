import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ customWords, setFilteredWords }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const searchMatchesGe = customWords.filter((word) =>
      word.germanWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const searchMatchesIt = customWords.filter((word) =>
      word.italianWord.toLowerCase().includes(searchWord.toLowerCase())
    );
    const combinedSearchMatches = [...searchMatchesGe, ...searchMatchesIt];
    if (combinedSearchMatches) {
      setFilteredWords(combinedSearchMatches);
    }
  };

  const handleChange = (e) => {
    setSearchWord(e.target.value);
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
        placeholder={isFocused ? "" : "Wort suchen"}
        className="pl-4 w-full min-h-[2.4rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none "
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <FaSearch
        onClick={handleSearch}
        size={20}
        color="gray"
        className="absolute top-1 right-0 z-10 cursor-pointer mt-1 mr-2"
      />
    </div>
  );
}
