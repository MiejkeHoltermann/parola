"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordList from "../components/WordList";
import useLocalStorageState from "use-local-storage-state";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WordListPage() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const { data: session } = useSession();
  const { data } = useSWR("/api/words", fetcher);

  /* 
  const { data } = useSWR("/api/words", fetcher);

 
  const sortedWords = words.sort((a, b) =>
    a.germanWord.localeCompare(b.germanWord)
  ); */

  const [wordsLevel0, setWordsLevel0] = useState([]);
  const [wordsLevel1, setWordsLevel1] = useState([]);
  const [wordsLevel2, setWordsLevel2] = useState([]);
  const [wordsLevel3, setWordsLevel3] = useState([]);
  const [wordsLevel4, setWordsLevel4] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (data && session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            cache: "no-store",
          });
          const userData = await response.json();
          const { wordsLevel1, wordsLevel2, wordsLevel3, wordsLevel4 } =
            userData;
          setWordsLevel1(wordsLevel1);
          setWordsLevel2(wordsLevel2);
          setWordsLevel3(wordsLevel3);
          setWordsLevel4(wordsLevel4);
          const { words } = data;
          const wordsLevel0 = words.filter((word) => {
            return ![1, 2, 3, 4].some((level) =>
              userData[`wordsLevel${level}`].some(
                (levelWord) => levelWord._id === word._id
              )
            );
          });
          setWordsLevel0(wordsLevel0);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [data, session]);

  if (!data) {
    return <p>Loading...</p>;
  }
  const levelWordsMap = {
    0: wordsLevel0,
    1: wordsLevel1,
    2: wordsLevel2,
    3: wordsLevel3,
    4: wordsLevel4,
  };

  const currentLevelWords = levelWordsMap[level];

  return (
    <main>
      {currentLevelWords.length > 0 ? (
        <>
          {currentLevelWords.map((word) => (
            <WordList
              key={word._id}
              id={word._id}
              germanWord={word.germanWord}
              italianWord={word.italianWord}
            />
          ))}
        </>
      ) : (
        <p>{`Du hast keine Wörter auf Level ${level + 1}.`}</p>
      )}
    </main>
  );
}
