import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import { useSession } from "next-auth/react";
import DefaultError from "./DefaultError";

export default function EditModal({
  wordId,
  setEditMode,
  germanWord,
  italianWord,
  setNewGermanWord,
  setNewItalianWord,
  newGermanWord,
  newItalianWord,
  deleteModal,
  setDeleteModal,
  removeWord,
  updateWord,
  error,
  setError,
}) {
  const { data: session, status } = useSession();
  const userId = session.user.id;

  const handleGermanInputChange = (e) => {
    setNewGermanWord(e.target.value.trim());
    setError("");
  };

  const handleItalianInputChange = (e) => {
    setNewItalianWord(e.target.value.trim());
    setError("");
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const cancelEdit = () => {
    setNewGermanWord(germanWord);
    setNewItalianWord(italianWord);
    setError("");
    setEditMode(false);
  };

  return (
    <>
      {!deleteModal ? (
        <div className="flex flex-col items-center gap-[1rem]">
          <div className="w-full flex justify-between">
            <button onClick={toggleDeleteModal} className="self-start">
              <HiOutlineTrash size={28} style={{ color: "#027863" }} />
            </button>
            <button
              onClick={() => cancelEdit()}
              className="ml-auto bg-darkmint flex justify-center items-center text-white w-[1.8rem] h-[1.8rem] rounded-md"
            >
              <Image
                src="/cross.svg"
                alt="close button"
                width={80}
                height={80}
                className="w-[1.5rem] h-[1.5rem]"
              ></Image>
            </button>
          </div>
          <input
            onChange={handleGermanInputChange}
            autoFocus
            onDoubleClick={() => setNewGermanWord("")}
            value={newGermanWord}
            type="text"
            id="germanWordInput"
            name="germanWordInput"
            placeholder="deutsches Wort"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handleItalianInputChange}
            onDoubleClick={() => setNewItalianWord("")}
            value={newItalianWord}
            type="text"
            id="italianWordInput"
            name="italianWordInput"
            placeholder="italienisches Wort"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          {error && <DefaultError errorMessage={error} />}
          <button
            onClick={() => updateWord()}
            type="button"
            className="bg-mint w-[7rem] text-white text-center font-bold cursor-pointer rounded-lg px-[0.2rem] py-[0.3rem] mt-[0.4rem]"
          >
            Speichern
          </button>
        </div>
      ) : (
        <DeleteModal
          closeDeleteModal={toggleDeleteModal}
          removeWord={removeWord}
          wordId={wordId}
        />
      )}
    </>
  );
}
