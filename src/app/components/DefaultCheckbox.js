export default function DefaultCheckbox({
  onChange,
  checked,
  defaultChecked,
  checkboxId,
  checkboxName,
  checkboxValue,
  checkboxLabel,
}) {
  return (
    <label
      htmlFor={checkboxId}
      className="flex items-center justify-between gap-[1rem]"
    >
      <input
        type="checkbox"
        id={checkboxId}
        name={checkboxName}
        value={checkboxValue}
        onChange={onChange}
        checked={checked}
        defaultChecked={defaultChecked}
        className="accent-mint w-[1.4rem] h-[1.4rem]"
      />

      {checkboxLabel}
    </label>
  );
}
