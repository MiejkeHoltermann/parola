export default function DefaultError({ errorMessage, correct }) {
  return (
    <div
      style={{ color: correct ? "green" : "red" }}
      className="text-center font-bold rounded-md px-[1rem] mt-2"
    >
      {errorMessage}
    </div>
  );
}
