"use client";
import { useSWRConfig } from "swr";
import { HiOutlineTrash } from "react-icons/hi";
import { useSession } from "next-auth/react";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }) {
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const removeWord = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed && session) {
      const userId = session.user.id;
      const wordId = id;
      const res = await fetch("/api/deleteWord", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, wordId }),
      });

      if (res.ok) {
        mutate("/api/deleteWords");
      }
    }
  };

  return (
    <button
      onClick={removeWord}
      className="text-white w-6 h-6 bg-red-600 rounded-[0.3rem]"
    >
      <HiOutlineTrash size={24} />
    </button>
  );
}
