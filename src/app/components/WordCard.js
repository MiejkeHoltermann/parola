"use client";
import Image from "next/image";
import FaveButton from "./FaveButton";
import { useState } from "react";
import { useSession } from "next-auth/react";
import EditModal from "./EditModal";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

export default function WordCard({
  wordId,
  isFavorite,
  germanWord,
  italianWord,
  newWord,
  setFilteredWords,
}) {
  const [editedGermanWord, setEditedGermanWord] = useState(germanWord);
  const [editedItalianWord, setEditedItalianWord] = useState(italianWord);
  const { data: session } = useSession();

  const { mutate } = useSWRConfig({
    revalidateOnFocus: true,
  });
  const [editMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const openEditMode = () => {
    setEditMode(true);
  };

  const closeEditMode = async () => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else {
      const userId = session.user.id;
      const res = await fetch("/api/updateWord", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          wordId,
          editedGermanWord,
          editedItalianWord,
        }),
      });
      if (res.ok) {
        console.log("Successfully updated word.");
        mutate("/api/updateWord");
      } else {
        console.log("Error updating word.");
      }
    }
    setEditMode(false);
  };

  const removeWord = async (wordId) => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else {
      const userId = session.user.id;
      const res = await fetch("/api/deleteWord", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, wordId }),
      });
      const { newWords } = await res.json();
      if (res.ok) {
        setFilteredWords(newWords);
      }
      setDeleteModal(false);
      setEditMode(false);
    }
  };

  return (
    <>
      {!editMode ? (
        <div
          onDoubleClick={openEditMode}
          className={` ${
            newWord === wordId ? "bg-[rgba(0,215,177,1)]" : "bg-white"
          } w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-2`}
        >
          <div className="relative w-full flex gap-4 pb-2">
            <Image
              src="/german-flag-round.svg"
              alt="german flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <p className="w-full break-all">{editedGermanWord}</p>
            <FaveButton wordId={wordId} isFavorite={isFavorite} />
          </div>
          <hr className="border-gray-300 w-full" />
          <div className="relative w-full flex gap-4 pt-2">
            <Image
              src="/italian-flag-round.svg"
              alt="italian flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <p className="w-full break-all">{editedItalianWord}</p>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={closeEditMode}
          className="relative w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4"
        >
          <EditModal
            wordId={wordId}
            setEditMode={setEditMode}
            editedGermanWord={editedGermanWord}
            setEditedGermanWord={setEditedGermanWord}
            editedItalianWord={editedItalianWord}
            setEditedItalianWord={setEditedItalianWord}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            removeWord={removeWord}
          />
        </div>
      )}
    </>
  );
}
