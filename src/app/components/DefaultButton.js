export default function DefaultButton({
  buttonFunction,
  buttonType,
  buttonText,
  smallSize,
  color,
  disabled,
}) {
  return (
    <button
      onClick={buttonFunction}
      type={buttonType}
      disabled={disabled}
      className={`text-white font-bold cursor-pointer rounded-lg px-6 ${
        smallSize
          ? `w-[${smallSize}] py-[0.3rem] mt-[1rem]`
          : "w-[10rem] py-[0.5rem] mt-[2rem]"
      }`}
      style={{
        backgroundColor: color ? color : "#027863",
        color: disabled ? "rgb(52,147,130)" : "white",
      }}
    >
      {buttonText}
    </button>
  );
}
