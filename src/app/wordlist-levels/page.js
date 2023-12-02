"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Levels() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [length0, setLength0] = useState(null);
  const [length1, setLength1] = useState(null);
  const [length2, setLength2] = useState(null);
  const [length3, setLength3] = useState(null);
  const [length4, setLength4] = useState(null);

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
          const { wordsLevel1, wordsLevel2, wordsLevel3, wordsLevel4 } =
            userData;
          setLength1(wordsLevel1.length);
          setLength2(wordsLevel2.length);
          setLength3(wordsLevel3.length);
          setLength4(wordsLevel4.length);
          const { words } = data;
          const wordsLevel0 = words.filter((word) => {
            return ![1, 2, 3, 4].some((level) =>
              userData[`wordsLevel${level}`].some(
                (levelWord) => levelWord._id === word._id
              )
            );
          });
          console.log(wordsLevel0);
          setLength0(wordsLevel0.length);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [data, session]);

  const filterUnpracticed = () => {
    setLevel(0);
    router.push("/wordlist");
  };

  const filterLevel1 = () => {
    setLevel(1);
    router.push("/wordlist");
  };

  const filterLevel2 = () => {
    setLevel(2);
    router.push("/wordlist");
  };

  const filterLevel3 = () => {
    setLevel(3);
    router.push("/wordlist");
  };

  const filterLevel4 = () => {
    setLevel(4);
    router.push("/wordlist");
  };

  return (
    <main>
      <h1 className="text-xl font-bold">Wähle ein Level aus</h1>
      <button
        onClick={filterUnpracticed}
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        <p>Level 1</p>
        <p>({length0} Wörter)</p>
      </button>
      <button
        onClick={filterLevel1}
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        <p>Level 2</p>
        <p>({length1} Wörter)</p>
      </button>
      <button
        onClick={filterLevel2}
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        <p>Level 3</p>
        <p>({length2} Wörter)</p>
      </button>
      <button
        onClick={filterLevel3}
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        <p>Level 4</p>
        <p>({length3} Wörter)</p>
      </button>
      <button
        onClick={filterLevel4}
        className="bg-gray-800 flex justify-center gap-2 text-white w-80 font-bold rounded-xl cursor-pointer px-6 py-2"
      >
        <p>Level 5</p>
        <p>({length4} Wörter)</p>
      </button>
    </main>
  );
}
