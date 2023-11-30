"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { HiOutlineTrash } from "react-icons/hi";

export default function DeleteButton({ id }) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const removeWord = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/words?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        mutate("/api/words");
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
