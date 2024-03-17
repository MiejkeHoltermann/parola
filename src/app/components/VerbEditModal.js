import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import { useSession } from "next-auth/react";
import DefaultError from "./DefaultError";

export default function EditModal({
  verbId,
  setEditMode,
  name,
  presente01,
  presente02,
  presente03,
  presente04,
  presente05,
  presente06,
  newName,
  newPresente01,
  newPresente02,
  newPresente03,
  newPresente04,
  newPresente05,
  newPresente06,
  setNewName,
  setNewPresente01,
  setNewPresente02,
  setNewPresente03,
  setNewPresente04,
  setNewPresente05,
  setNewPresente06,
  deleteModal,
  setDeleteModal,
  removeVerb,
  updateVerb,
  error,
  setError,
}) {
  const { data: session, status } = useSession();
  const userId = session.user.id;

  const handleNameChange = (e) => {
    setNewName(e.target.value.trim());
    setError("");
  };

  const handlePresente01Change = (e) => {
    setNewPresente01(e.target.value.trim());
    setError("");
  };
  const handlePresente02Change = (e) => {
    setNewPresente02(e.target.value.trim());
    setError("");
  };
  const handlePresente03Change = (e) => {
    setNewPresente03(e.target.value.trim());
    setError("");
  };
  const handlePresente04Change = (e) => {
    setNewPresente04(e.target.value.trim());
    setError("");
  };
  const handlePresente05Change = (e) => {
    setNewPresente05(e.target.value.trim());
    setError("");
  };
  const handlePresente06Change = (e) => {
    setNewPresente06(e.target.value.trim());
    setError("");
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const cancelEdit = () => {
    setNewName(name);
    setNewPresente01(presente01);
    setNewPresente02(presente02);
    setNewPresente03(presente03);
    setNewPresente04(presente04);
    setNewPresente05(presente05);
    setNewPresente06(presente06);
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
            onChange={handleNameChange}
            autoFocus
            onDoubleClick={() => setNewName("")}
            value={newName}
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente01Change}
            onDoubleClick={() => setNewPresente01("")}
            value={newPresente01}
            type="text"
            id="presente01"
            name="presente01"
            placeholder="Presente01"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente02Change}
            onDoubleClick={() => setNewPresente02("")}
            value={newPresente02}
            type="text"
            id="presente02"
            name="presente02"
            placeholder="Presente02"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente03Change}
            onDoubleClick={() => setNewPresente03("")}
            value={newPresente03}
            type="text"
            id="presente03"
            name="presente03"
            placeholder="Presente03"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente04Change}
            onDoubleClick={() => setNewPresente04("")}
            value={newPresente04}
            type="text"
            id="presente04"
            name="presente04"
            placeholder="Presente04"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente05Change}
            onDoubleClick={() => setNewPresente05("")}
            value={newPresente05}
            type="text"
            id="presente05"
            name="presente05"
            placeholder="Presente05"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          <input
            onChange={handlePresente06Change}
            onDoubleClick={() => setNewPresente06("")}
            value={newPresente06}
            type="text"
            id="presente06"
            name="presente06"
            placeholder="Presente06"
            className="pl-6 w-full min-h-[2.8rem] border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-gray-300"
          />
          {error && <DefaultError errorMessage={error} />}
          <button
            onClick={() => updateVerb()}
            type="button"
            className="bg-mint w-[7rem] text-white text-center font-bold cursor-pointer rounded-lg px-[0.2rem] py-[0.3rem] mt-[0.4rem]"
          >
            Speichern
          </button>
        </div>
      ) : (
        <DeleteModal
          closeDeleteModal={toggleDeleteModal}
          removeWord={removeVerb}
          wordId={verbId}
        />
      )}
    </>
  );
}
