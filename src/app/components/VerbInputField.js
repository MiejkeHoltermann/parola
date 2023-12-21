export default function VerbInputField({
  i,
  label,
  presenteValues,
  setPresenteValues,
  isCorrect,
}) {
  return (
    <div key={i} className="flex items-center gap-4">
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
        className={`border rounded-lg p-1 ${
          isCorrect[i] === false
            ? "border-2 border-red-500 text-red-700"
            : "border-1 border-gray-400"
        }`}
      />
    </div>
  );
}
