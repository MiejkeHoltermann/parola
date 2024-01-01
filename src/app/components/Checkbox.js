export default function Checkbox({
  checkboxId,
  checkboxName,
  checkboxValue,
  checkboxLabel,
  onChange,
  favorite,
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="checkbox"
        id={checkboxId}
        name={checkboxName}
        value={checkboxValue}
        defaultChecked={false}
        onChange={onChange}
        className={`relative peer appearance-none w-5 h-5 rounded-md ${
          favorite
            ? "bg-[rgba(2,120,99,1)] border-0"
            : "bg-white border-[1px] border-gray-400"
        }`}
      />
      <label htmlFor={checkboxId}>{checkboxLabel}</label>
      <svg
        className={`absolute ml-[2px] w-4 h-4 peer ${
          favorite ? "block" : "hidden"
        } pointer-events-none`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
}
