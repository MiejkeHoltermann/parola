"use client";
import { useState } from "react";
import Image from "next/image";
import FaveButton from "./FaveButton";
import EditModal from "./EditModal";
import { RiEdit2Fill } from "react-icons/ri";

export default function WordCard({
  wordId,
  isFavorite,
  germanWord,
  italianWord,
  setFilteredWords,
  setCustomWords,
  setError,
}) {
  const [newGermanWord, setNewGermanWord] = useState(germanWord);
  const [newItalianWord, setNewItalianWord] = useState(italianWord);
  const [editModal, setEditModal] = useState(false);

  return (
    <>
      {!editModal ? (
        // renders the normal WordCard
        <div className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-[1rem] py-[0.6rem]">
          <div className="w-full flex gap-[1rem] pb-[0.6rem]">
            <Image
              src="/german-flag.svg"
              alt="german flag"
              width={50}
              height={50}
              className="w-[1.6rem] h-[1.6rem]"
            />
            <p className="w-full">{newGermanWord}</p>
            <FaveButton
              wordId={wordId}
              isFavorite={isFavorite}
              setCustomWords={setCustomWords}
              setError={setError}
            />
          </div>
          <hr className="border-gray-300 w-full" />
          <div className="w-full flex gap-[1rem] pt-[0.6rem]">
            <Image
              src="/italian-flag.svg"
              alt="italian flag"
              width={50}
              height={50}
              className="w-[1.6rem] h-[1.6rem"
            />
            <p className="w-full">{newItalianWord}</p>
            <button onClick={() => setEditModal(true)}>
              <RiEdit2Fill size={20} />
            </button>
          </div>
        </div>
      ) : (
        // renders the WordCard in editing mode
        <div className="relative w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4">
          <EditModal
            wordId={wordId}
            setEditModal={setEditModal}
            germanWord={germanWord}
            italianWord={italianWord}
            newGermanWord={newGermanWord}
            setNewGermanWord={setNewGermanWord}
            newItalianWord={newItalianWord}
            setNewItalianWord={setNewItalianWord}
            setCustomWords={setCustomWords}
            setFilteredWords={setFilteredWords}
            setError={setError}
          />
        </div>
      )}
    </>
  );
}
