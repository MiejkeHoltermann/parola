export default function VerbInputField({
  i,
  label,
  presenteValues,
  setPresenteValues,
  isCorrect,
}) {
  return (
    <div key={i} className="flex items-center justify-end gap-4">
      <label htmlFor={`presente0${i + 1}`}>{label}</label>
      <input
        type="text"
        id={`presente0${i + 1}`}
        name={`presente0${i + 1}`}
        value={presenteValues[i]}
        onChange={(e) => {
          const newValues = [...presenteValues];
          newValues[i] = e.target.value;
          setPresenteValues(newValues);
        }}
        className={`w-[70%] flex flex-col rounded-xl px-4 py-2 mr-5 focus:outline-none border ${
          isCorrect[i] === false
            ? "border-2 border-red-500 text-red-700 shadow-none"
            : "border-1 shadow-[2px_2px_rgba(0,215,177,1)]"
        }`}
      />
    </div>
  );
}
