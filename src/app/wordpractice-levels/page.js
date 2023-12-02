"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";
import LevelButton from "../components/LevelButton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WordPracticeLevels() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [lengths, setLengths] = useState(Array(5).fill(0));

  const router = useRouter();
  const { data: session } = useSession();
  const { data } = useSWR("/api/words", fetcher);

  useEffect(() => {
    const fetchData = async () => {
      if (data && session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const userData = await response.json();
          const levels = [
            null,
            "wordsLevel2",
            "wordsLevel3",
            "wordsLevel4",
            "wordsLevel5",
          ];

          setLengths(levels.map((level) => userData[level]?.length ?? 0));

          const wordsLevel1 = data.words.filter((word) => {
            return ![2, 3, 4, 5].some((level) =>
              userData[`wordsLevel${level}`].some(
                (levelWord) => levelWord._id === word._id
              )
            );
          });

          setLengths((prev) => [
            wordsLevel1.length,
            ...prev.slice(1, prev.length),
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [data, session]);

  const filterLevel = (selectedLevel) => {
    setLevel(selectedLevel);
    router.push("/wordpractice");
  };

  return (
    <main>
      <h1 className="text-xl font-bold">Wähle ein Level aus</h1>
      <p>
        Jedes Wort, das du richtig benennst, steigt ein Level auf. So festigst
        du durch regelmäßige Wiederholungen deinen Wortschatz.
      </p>
      {lengths.map((length, index) => (
        <LevelButton
          key={index + 1}
          level={index + 1}
          length={length}
          onClick={() => filterLevel(index + 1)}
        />
      ))}
    </main>
  );
}
