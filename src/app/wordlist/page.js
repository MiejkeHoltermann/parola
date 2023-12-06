"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordCard from "../components/WordCard";
import useLocalStorageState from "use-local-storage-state";
import Link from "next/link";
import { shuffle } from "fast-shuffle";
import { useRouter } from "next/navigation";

export default function WordListPage() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [number, setNumber] = useLocalStorageState("number", {
    defaultValue: null,
  });
  const [customWords, setCustomWords] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session.user.id;

  useEffect(() => {
    const fetchData = async () => {
      if (userId && level && number) {
        const response = await fetch(`/api/users/${userId}/${level}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { customWordsFiltered } = await response.json();
        const shuffledWords = shuffle(customWordsFiltered);
        const activeWords = shuffledWords.slice(0, number);
        setCustomWords(activeWords);
      }
    };
    fetchData();
  }, [userId, level, number]);

  const handleClick = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/${level}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, customWords }),
      });
      if (response.ok) {
        router.push("/wordpractice");
        console.log("ok");
      } else {
        console.log("Error fetching data. Status: ", response.status);
      }
    } catch (error) {
      console.log("Error fetching data.", error);
    }
  };

  return (
    <main>
      {customWords.length > 0 ? (
        <>
          <p>Klicke auf ein Wort, um dir die Übersetzung anzeigen zu lassen.</p>
          {customWords.map((word) => (
            <WordCard
              key={word._id}
              id={word._id}
              germanWord={word.germanWord}
              italianWord={word.italianWord}
            />
          ))}
          <button
            onClick={handleClick}
            className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
          >
            Frag mich ab
          </button>
        </>
      ) : (
        <>
          <p>{`Du hast keine Wörter auf Level ${level}.`}</p>{" "}
          <Link
            href="/wordlist-levels"
            className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
          >
            Zurück
          </Link>
        </>
      )}
    </main>
  );
}
