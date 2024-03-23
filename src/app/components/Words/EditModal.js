import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";

import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import DefaultError from "../DefaultError";
import CloseButton from "../CloseButton";
import DefaultInput from "../DefaultInput";
import DefaultButton from "../DefaultButton";
import { useState } from "react";

export default function EditModal({
  wordId,
  setEditMode,
  germanWord,
  italianWord,
  newGermanWord,
  setNewGermanWord,
  newItalianWord,
  setNewItalianWord,
  setFilteredWords,
}) {
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const { data: session } = useSession();
  const { mutate } = useSWRConfig({
    revalidateOnFocus: true,
  });

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const cancelEditing = () => {
    setNewGermanWord(germanWord);
    setNewItalianWord(italianWord);
    setError("");
    setEditMode(false);
  };

  const updateWord = async () => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else if (newGermanWord.length === 0 || newItalianWord.length === 0) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    } else {
      const userId = session.user.id;
      const response = await fetch(`api/users/${userId}/words`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          wordId,
          newGermanWord,
          newItalianWord,
        }),
      });
      if (response.ok) {
        console.log("Successfully updated word.");
        mutate("/api/updateWord");
      } else {
        console.log("Error updating word.");
      }
    }
    setEditMode(false);
  };

  return (
    <>
      {!deleteModal ? (
        <div className="flex flex-col items-center gap-[0.4rem]">
          <div className="w-full flex justify-between mb-[0.6rem]">
            <button onClick={toggleDeleteModal} className="self-start">
              <HiOutlineTrash size={28} style={{ color: "#027863" }} />
            </button>
            <CloseButton buttonFunction={cancelEditing} />
          </div>
          <DefaultInput
            value={newGermanWord}
            setValue={setNewGermanWord}
            setError={setError}
            inputId="germanWordInput"
            inputName="germanWordInput"
            placeholder="deutsches Wort"
          />
          <DefaultInput
            value={newItalianWord}
            setValue={setNewItalianWord}
            setError={setError}
            inputId="italianWordInput"
            inputName="italianWordInput"
            placeholder="italienisches Wort"
          />
          {error && <DefaultError errorMessage={error} />}
          <DefaultButton
            buttonFunction={updateWord}
            buttonType="button"
            buttonText="Speichern"
            smallSize="5rem"
          />
        </div>
      ) : (
        <DeleteModal
          wordId={wordId}
          setFilteredWords={setFilteredWords}
          toggleDeleteModal={toggleDeleteModal}
          setEditMode={setEditMode}
        />
      )}
    </>
  );
}
