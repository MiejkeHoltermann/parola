"use client";

import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";

export default function Levels() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });

  const router = useRouter();

  const filterUnpracticed = () => {
    setLevel(0);
    router.push("/practise");
  };

  const filterLevel1 = () => {
    setLevel(1);
    router.push("/practise");
  };

  return (
    <main>
      <button onClick={filterUnpracticed} className="underline">
        Ungelernt
      </button>
      <button onClick={filterLevel1} className="underline">
        Level 1
      </button>
    </main>
  );
}
