"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function WordListLevels() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [number, setNumber] = useLocalStorageState("number", {
    defaultValue: null,
  });
  const [wordsLevels, setWordsLevels] = useState(Array(5).fill(0));

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const {
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
          } = await response.json();
          setWordsLevels([
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numberOfWords = e.target.elements.numberOfWords.value;
    const wordsLevel = e.target.elements.wordsLevel.value;
    if (!numberOfWords || !wordsLevel) {
      console.log("Alle Felder müssen ausgefüllt werden.");
      return;
    }
    setNumber(numberOfWords);
    setLevel(wordsLevel);
    if (number && level) {
      router.push("/wordlist");
    }
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="relative w-[90%] flex flex-col items-center p-4 gap-6"
      >
        <label htmlFor="numberOfWords">
          Wie viele Wörter möchtest du heute lernen?
        </label>
        <input type="number" id="numberOfWords" name="numberOfWords" min="1" />
        <label htmlFor="wordsLevel">Wähle ein Level aus</label>
        <select id="wordsLevel" name="wordsLevel">
          {wordsLevels.map((count, index) => (
            <option key={index + 1} value={index + 1}>
              Level {index + 1} ({count} Wörter)
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
        >
          Los geht's
        </button>
      </form>
    </main>
  );
}
