export default function DefaultCheckbox({
  checkboxId,
  checkboxName,
  checkboxValue,
  checkboxLabel,
  defaultChecked,
  onChange,
  checked,
}) {
  return (
    <div className="w-[10rem] flex items-center gap-[1rem]">
      <input
        type="checkbox"
        id={checkboxId}
        name={checkboxName}
        value={checkboxValue}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className={`relative peer appearance-none w-[1.8rem] h-[1.8rem] rounded-md ${
          checked
            ? "bg-[rgba(2,120,99,1)] border-0"
            : "bg-white border-[1px] border-gray-400"
        }`}
      />
      <label htmlFor={checkboxId}>{checkboxLabel}</label>
      <svg
        className={`absolute ml-[0.2rem] w-[1.4rem] peer ${
          checked ? "block" : "hidden"
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
