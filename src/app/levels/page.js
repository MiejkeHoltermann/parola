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

  const filterLevel2 = () => {
    setLevel(2);
    router.push("/practise");
  };

  const filterLevel3 = () => {
    setLevel(3);
    router.push("/practise");
  };

  const filterLevel4 = () => {
    setLevel(4);
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
      <button onClick={filterLevel2} className="underline">
        Level 2
      </button>
      <button onClick={filterLevel3} className="underline">
        Level 3
      </button>
      <button onClick={filterLevel4} className="underline">
        Level 4
      </button>
    </main>
  );
}
