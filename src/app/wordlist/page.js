"use client";
import useSWR from "swr";
import Image from "next/image";
import DeleteButton from "../components/DeleteButton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WordList() {
  const { data } = useSWR("/api/words", fetcher);
  if (!data) {
    return <p>Loading...</p>;
  }

  const { words } = data;
  const sortedWords = words.sort((a, b) =>
    a.germanWord.localeCompare(b.germanWord)
  );

  return (
    <main>
      {sortedWords.map((word) => (
        <ul key={word._id} className="w-full flex flex-col items-center">
          <li className="w-[90%] flex rounded-xl shadow-xl p-4">
            <div className="w-full">
              <div className="relative w-full flex gap-8 pb-4">
                <Image
                  src="/german-flag-round.svg"
                  alt="german flag"
                  width={100}
                  height={100}
                  className="w-6 h-6"
                />
                <p className="w-full">{word.germanWord}</p>
              </div>
              <hr className="border-gray-300 w-full" />
              <div className="relative w-full flex gap-8 pt-4">
                <Image
                  src="/italian-flag-round.svg"
                  alt="italian flag"
                  width={100}
                  height={100}
                  className="w-6 h-6"
                />
                <p className="w-full">{word.italianWord}</p>
              </div>
            </div>
            <DeleteButton id={word._id} />
          </li>
        </ul>
      ))}
    </main>
  );
}
