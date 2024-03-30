import { useState } from "react";
import Image from "next/image";

export default function SelectPracticeTypeInput({
  practiceType,
  setPracticeType,
}) {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleOptions = (option) => {
    setPracticeType(option);
    setDropdown(false);
  };

  return (
    <div className="relative w-[14rem] h-[2.2rem] flex flex-col justify-center border border-gray-300 rounded-md hover:shadow-lg">
      <button
        onClick={toggleDropdown}
        type="button"
        className="flex items-center justify-between px-[1.2rem]"
      >
        {practiceType}
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
            <li
              onClick={() => handleOptions("Typing")}
              className="py-[0.4rem] pl-[1.2rem]"
            >
              Typing
            </li>
            <li
              onClick={() => handleOptions("Wordscramble")}
              className="py-[0.4rem] pl-[1.2rem]"
            >
              Wordscramble
            </li>
            <li
              onClick={() => handleOptions("Multiple choice")}
              className="py-[0.4rem] pl-[1.2rem]"
            >
              Multiple choice
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
