import { useState } from "react";
import Image from "next/image";

export default function SelectLevelInput({
  setLevel,
  defaultOption,
  setDefaultOption,
  options,
  wordsLevels,
}) {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleOptions = (index) => {
    setLevel(index + 1);
    setDefaultOption(options[index]);
    setDropdown(false);
  };

  return (
    <div className="relative w-[14rem] h-[2.2rem] mb-[1rem] flex flex-col justify-center border border-gray-300 rounded-md">
      <button
        onClick={toggleDropdown}
        type="button"
        className="flex items-center justify-between px-[1.2rem]"
      >
        {defaultOption}
        <Image
          src="/arrow.svg"
          alt="arrow"
          width={100}
          height={100}
          className="w-[1rem] h-[1rem] flex justify-center items-center"
        />
      </button>
      {dropdown && (
        <div className="bg-white absolute top-[2.2rem] left-0 z-20 w-[14rem] shadow-[6px_6px_20px_rgba(0,0,0,0.2)] rounded-lg">
          <ul className="pb-[0.6rem]">
            {wordsLevels.map((count, index) => (
              <li
                key={index + 1}
                onClick={() => handleOptions(index)}
                className="py-[0.4rem] pl-[1.2rem]"
              >
                {options[index]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
