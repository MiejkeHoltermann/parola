export default function LevelButton({ level, length, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
    >
      <p>{`Level ${level}`}</p>
      <p>({length} Wörter)</p>
    </button>
  );
}
