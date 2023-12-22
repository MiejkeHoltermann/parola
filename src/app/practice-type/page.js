"use client";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";

export default function WordListLevels() {
  const [level, setLevel] = useLocalStorageState("level", {
    defaultValue: null,
  });
  const [number, setNumber] = useLocalStorageState("number", {
    defaultValue: null,
  });
  const [practiceType, setPracticeType] = useLocalStorageState("practiceType", {
    defaultValue: null,
  });

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const practiceType = e.target.elements.practiceType.value;
    setPracticeType(practiceType);
    if (practiceType) {
      router.push("/wordpractice");
    }
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="relative w-[90%] flex flex-col items-center p-4 gap-6"
      >
        <label htmlFor="practiceType">Wie möchtest du abgefragt werden?</label>
        <select id="practiceType" name="practiceType">
          <option value="typing">Eintippen</option>
          <option value="wordsalad">Wortsalat</option> 
          <option value="multipleChoice">Multiple Choice</option>
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
