export default function DefaultButton({
  buttonFunction,
  buttonType,
  buttonText,
}) {
  return (
    <button
      onClick={buttonFunction}
      type={buttonType}
      className="bg-mint min-w-[8rem] text-white font-bold cursor-pointer rounded-lg px-6 py-2 mt-[2rem]"
    >
      {buttonText}
    </button>
  );
}
