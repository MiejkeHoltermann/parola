import { useState } from "react";

export default function DefaultInput({
  inputId,
  inputName,
  presenteValues,
  setPresenteValues,
  isCorrect,
  index,
  label,
}) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    const newValues = [...presenteValues];
    newValues[index] = e.target.value;
    setPresenteValues(newValues);
  };

  const handleDoubleClick = () => {
    setValue("");
  };

  return (
    <div className="w-[80%] flex justify-between">
      <label htmlFor={`presente${index + 1}`}>{label}</label>
      <input
        onChange={handleChange}
        onDoubleClick={handleDoubleClick}
        value={presenteValues[index]}
        type="text"
        id={inputId}
        name={inputName}
        className={`pl-6 w-[10rem] min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-lightblue ${
          isCorrect[index] === false
            ? "border-2 border-red-500 text-red-700 shadow-none"
            : "border-1 shadow-[2px_2px_rgba(0,215,177,1)]"
        }`}
      />
    </div>
  );
}
