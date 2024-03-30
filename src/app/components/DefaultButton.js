export default function DefaultButton({
  buttonFunction,
  buttonType,
  buttonText,
  color,
  disabled,
  size,
}) {
  return (
    <button
      onClick={buttonFunction}
      type={buttonType}
      disabled={disabled}
      className={`text-white font-bold cursor-pointer rounded-lg py-[0.4rem] mt-[1rem] ${
        !disabled && "hover:scale-105"
      }`}
      style={{
        backgroundColor: color ? color : "#027863",
        color: disabled ? "rgb(52,147,130)" : "white",
        width: size ? size : "8rem",
      }}
    >
      {buttonText}
    </button>
  );
}
