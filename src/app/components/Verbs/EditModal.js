import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import DefaultError from "../DefaultError";
import { useState } from "react";

export default function EditModal({
  verb,
  setEditMode,
  formData,
  setFormData,
  deleteModal,
  setDeleteModal,
  removeVerb,
  updateVerb,
  error,
  setError,
}) {
  const presenteLabels = ["Name", "io", "tu", "lei/lui", "noi", "voi", "loro"];
  const [initialFormData, setInitialFormData] = useState(formData);

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setError("");
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleDoubleClick = (fieldName) => {
    setFormData({ ...formData, [fieldName]: "" });
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
          {presenteLabels.map((label, index) => {
            const fieldName = index === 0 ? "newName" : `newPresente0${index}`;
            const fieldValue =
              index === 0
                ? formData.newName || ""
                : formData[fieldName] ||
                  verb.presente[`presente0${index}`] ||
                  "";
            return (
              <div key={index} className="grid grid-cols-4">
                <p>{label}</p>
                <input
                  onChange={handleInputChange}
                  onDoubleClick={() => handleDoubleClick(fieldName)}
                  value={fieldValue}
                  type="text"
                  id={fieldName}
                  name={fieldName}
                  placeholder={verb.presente[`presente0${index}`]}
                  className="pl-6 w-full min-h-[2.8rem] col-span-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:border-2 focus:border-lightblue"
                />
              </div>
            );
          })}
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
          wordId={verb._id}
        />
      )}
    </>
  );
}
