"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordList from "../components/WordList";
import useLocalStorageState from "use-local-storage-state";

export default function WordListPage() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [customWords, setCustomWords] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session && level) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}/${level}`, {
            cache: "no-store",
          });
          const { customWordsFiltered } = await response.json();
          setCustomWords(customWordsFiltered);
        } catch (error) {
          console.log("Error fetching data.", error);
        }
      }
    };
    fetchData();
  }, [session, level]);

  return (
    <main>
      {customWords.length > 0 ? (
        <>
          {customWords.map((word) => (
            <WordList
              key={word._id}
              id={word._id}
              germanWord={word.germanWord}
              italianWord={word.italianWord}
            />
          ))}
        </>
      ) : (
        <p>{`Du hast keine Wörter auf Level ${level}.`}</p>
      )}
    </main>
  );
}
