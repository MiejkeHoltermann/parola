import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import DefaultError from "../DefaultError";
import CloseButton from "../CloseButton";
import DefaultInput from "../DefaultInput";
import DefaultButton from "../DefaultButton";

export default function EditModal({
  wordId,
  setEditModal,
  germanWord,
  italianWord,
  newGermanWord,
  setNewGermanWord,
  newItalianWord,
  setNewItalianWord,
  setCustomWords,
  setFilteredWords,
  setError,
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [error2, setError2] = useState("");

  const { data: session } = useSession();

  // if the user cancels editing the word is reset to its initial value
  const cancelEditing = () => {
    setNewGermanWord(germanWord);
    setNewItalianWord(italianWord);
    setEditModal(false);
  };

  const updateWord = async () => {
    // checks whether all input fields are valid
    if (newGermanWord.length === 0 || newItalianWord.length === 0) {
      setError2("Alle Felder müssen ausgefüllt sein.");
      return;
    } else if (newGermanWord.length > 20 || newItalianWord.length > 20) {
      setError2("Keines der Wörter darf länger als 20 Zeichen sein.");
    } else if (session) {
      const userId = session.user.id;
      // updates the edited word in the database
      try {
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
        const { newCustomWords } = await response.json();
        if (newCustomWords) {
          setCustomWords(newCustomWords);
          setFilteredWords(newCustomWords);
          setError("");
        }
        // if an error occurs during the update, the word is reset to its initial value
        else {
          setNewGermanWord(germanWord);
          setNewItalianWord(italianWord);
          setError("Error updating word");
        }
      } catch (error) {
        setNewGermanWord(germanWord);
        setNewItalianWord(italianWord);
        setError("Error updating word");
      }
      setEditModal(false);
    }
  };

  return (
    <>
      {!deleteModal ? (
        <div className="flex flex-col items-center gap-[0.4rem]">
          <div className="w-full flex justify-between mb-[0.6rem]">
            <button onClick={() => setDeleteModal(true)} className="self-start">
              <HiOutlineTrash size={28} style={{ color: "#027863" }} />
            </button>
            <CloseButton buttonFunction={cancelEditing} />
          </div>
          <DefaultInput
            value={newGermanWord}
            setValue={setNewGermanWord}
            setError={setError2}
            inputId="germanWordInput"
            inputName="germanWordInput"
            placeholder="deutsches Wort"
          />
          <DefaultInput
            value={newItalianWord}
            setValue={setNewItalianWord}
            setError={setError2}
            inputId="italianWordInput"
            inputName="italianWordInput"
            placeholder="italienisches Wort"
          />
          {error2 && <DefaultError errorMessage={error2} />}
          <DefaultButton
            buttonFunction={updateWord}
            buttonType="button"
            buttonText="Speichern"
            size="8rem"
          />
        </div>
      ) : (
        <DeleteModal
          wordId={wordId}
          setCustomWords={setCustomWords}
          setFilteredWords={setFilteredWords}
          setDeleteModal={setDeleteModal}
          setEditModal={setEditModal}
          setError={setError}
        />
      )}
    </>
  );
}
