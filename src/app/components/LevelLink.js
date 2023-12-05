import Link from "next/link";

export default function LevelLink({ href, level, wordsCount, onClick }) {
  return (
    <Link
      onClick={onClick}
      href={href}
      className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
    >
      <p>{`Level ${level}`}</p>
      <p>{`(${wordsCount} Wörter)`}</p>
    </Link>
  );
}
