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
  englishWord,
  italianWord,
  newEnglishWord,
  setNewEnglishWord,
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
    setNewEnglishWord(englishWord);
    setNewItalianWord(italianWord);
    setEditModal(false);
  };

  const updateWord = async () => {
    // checks whether all input fields are valid
    if (newEnglishWord.length === 0 || newItalianWord.length === 0) {
      setError2("Please fill out all required fields.");
      return;
    } else if (newEnglishWord.length > 20 || newItalianWord.length > 20) {
      setError2("No input can be longer than 20 characters.");
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
            newEnglishWord,
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
          setNewEnglishWord(englishWord);
          setNewItalianWord(italianWord);
          setError("Error updating word");
        }
      } catch (error) {
        setNewEnglishWord(englishWord);
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
            value={newEnglishWord}
            setValue={setNewEnglishWord}
            setError={setError2}
            inputId="englishWordInput"
            inputName="englishWordInput"
            placeholder="English word"
          />
          <DefaultInput
            value={newItalianWord}
            setValue={setNewItalianWord}
            setError={setError2}
            inputId="italianWordInput"
            inputName="italianWordInput"
            placeholder="Italian word"
          />
          {error2 && <DefaultError errorMessage={error2} />}
          <DefaultButton
            buttonFunction={updateWord}
            buttonType="button"
            buttonText="Save"
            size="6rem"
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
