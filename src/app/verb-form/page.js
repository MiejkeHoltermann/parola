"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function WordListLevels() {
  const [timeform, setTimeform] = useLocalStorageState("timeform", {
    defaultValue: null,
  });
  const [number, setNumber] = useState();
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session.user.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numberOfVerbs = e.target.elements.numberOfVerbs.value;
    const verbsTimeform = e.target.elements.verbsTimeform.value;
    if (!numberOfVerbs || !verbsTimeform) {
      console.log("Alle Felder müssen ausgefüllt werden.");
      return;
    }
    setNumber(numberOfVerbs);
    setTimeform(verbsTimeform);
    if (number && timeform) {
      handleClick();
    }
  };

  const handleClick = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/verbs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, number }),
      });
      if (response.ok) {
        router.push("/verb-conjugator");
      } else {
        console.log("Error fetching data. Status: ", response.status);
      }
    } catch (error) {
      console.log("Error fetching data.", error);
    }
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="relative w-[90%] flex flex-col items-center p-4 gap-6"
      >
        <label htmlFor="numberofVerbs">
          Wie viele Verben möchtest du heute lernen?
        </label>
        <input type="number" id="numberOfVerbs" name="numberOfVerbs" min="1" />
        <label htmlFor="verbsTimeform">
          Welche Zeitformen möchtest du lernen?
        </label>
        <select id="verbsTimeform" name="verbsTimeform">
          <option value="presente">Presente</option>
          <option value="imperfetto">Imperfetto</option>
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
