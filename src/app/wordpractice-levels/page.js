"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import LevelLink from "../components/LevelLink";

export default function WordListLevels() {
  const [level, setLevel] = useLocalStorageState("level", {
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

  return (
    <main>
      <h1 className="text-xl font-bold">Wähle ein Level aus</h1>
      {wordsLevels.map((count, index) => (
        <LevelLink
          key={index}
          onClick={() => setLevel(index + 1)}
          href="/wordpractice"
          level={index + 1}
          wordsCount={count}
        />
      ))}
    </main>
  );
}
