export default function DefaultError({ errorMessage, correct }) {
  return (
    <div
      className={`text-${
        correct ? "green-600" : "red-500"
      } text-center font-bold rounded-md px-[1rem] mt-2`}
    >
      {errorMessage}
    </div>
  );
}
