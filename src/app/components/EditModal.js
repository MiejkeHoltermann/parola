import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import { useSession } from "next-auth/react";

export default function EditModal({
  wordId,
  setEditedGermanWord,
  setEditedItalianWord,
  editedGermanWord,
  editedItalianWord,
  deleteModal,
  setDeleteModal,
  removeWord,
}) {
  const { data: session, status } = useSession();
  const userId = session.user.id;

  const handleGermanInputChange = (e) => {
    setEditedGermanWord(e.target.value);
  };

  const handleItalianInputChange = (e) => {
    setEditedItalianWord(e.target.value);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  return (
    <>
      {!deleteModal ? (
        <>
          <div className="relative w-full flex gap-4 pb-4">
            <Image
              src="/german-flag-round.svg"
              alt="german flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <input
              type="text"
              value={editedGermanWord}
              onChange={handleGermanInputChange}
              autoFocus
              className="w-[60%] focus:outline-none text-[rgba(0,0,0,0.4)]"
            />
            <button onClick={toggleDeleteModal}>
              <HiOutlineTrash size={24} />
            </button>
          </div>
          <hr className="border-gray-300 w-full" />
          <div className="relative w-full flex gap-4 pt-4">
            <Image
              src="/italian-flag-round.svg"
              alt="italian flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <input
              type="text"
              value={editedItalianWord}
              onChange={handleItalianInputChange}
              className="w-[60%] focus:outline-none text-[rgba(0,0,0,0.4)]"
            />
          </div>
        </>
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
