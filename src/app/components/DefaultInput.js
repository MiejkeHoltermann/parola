export default function DefaultInput({
  onDoubleClick,
  value,
  setValue,
  setError,
  inputId,
  inputName,
  placeholder,
}) {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleFocus = () => {
    setValue("");
    setError("");
  };

  return (
    <>
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        onDoubleClick={onDoubleClick}
        value={value}
        type="text"
        id={inputId}
        name={inputName}
        placeholder={placeholder}
        className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-lightblue"
      />
      <label htmlFor={inputId} className="text-[0]">
        {inputName}
      </label>
    </>
  );
}
