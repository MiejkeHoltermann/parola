import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import DeleteModal from "./DeleteModal";
import DefaultError from "../DefaultError";
import { HiOutlineTrash } from "react-icons/hi";
import DefaultButton from "../DefaultButton";
import CloseButton from "../CloseButton";

export default function EditModal({
  verb,
  setCustomVerbs,
  setFilteredVerbs,
  setEditModal,
  error,
  setError,
}) {
  const [formData, setFormData] = useState({
    newName: verb.name,
    newPresente01: verb.presente.presente01,
    newPresente02: verb.presente.presente02,
    newPresente03: verb.presente.presente03,
    newPresente04: verb.presente.presente04,
    newPresente05: verb.presente.presente05,
    newPresente06: verb.presente.presente06,
  });
  const [initialFormData, setInitialFormData] = useState(formData);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error2, setError2] = useState("");
  const presenteLabels = ["Name", "io", "tu", "lei/lui", "noi", "voi", "loro"];

  const { data: session } = useSession();

  // if the user cancels editing the verb is reset to its initial value
  const cancelEdit = () => {
    setFormData(initialFormData);
    setError("");
    setEditModal(false);
  };

  const updateVerb = async () => {
    // checks whether all input fields are valid
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError2("Please fill out all required fields.");
      return;
    } else if (Object.values(formData).some((value) => value.length > 20)) {
      setError2("No input can be longer than 20 characters.");
      return;
    } else if (session) {
      const userId = session.user.id;
      const verbId = verb._id;
      // updates the edited verb in the database
      try {
        const response = await fetch(`api/users/${userId}/verbs`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            verbId,
            ...formData,
          }),
        });
        const { customVerbs } = await response.json();
        if (customVerbs) {
          setCustomVerbs(customVerbs);
          setFilteredVerbs(customVerbs);
          setError("");
        }
        // if an error occurs during the update, the verb is reset to its initial value
        else {
          setFormData(initialFormData);
          setError("Error updating verb");
        }
      } catch (error) {
        setFormData(initialFormData);
        setError("Error updating verb");
      }
    }
    setEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setError2("");
  };

  const handleDoubleClick = (fieldName) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  return (
    <>
      {!deleteModal ? (
        <div className="flex flex-col items-center gap-[1rem]">
          <div className="w-full flex justify-between">
            <button onClick={() => setDeleteModal(true)} className="self-start">
              <HiOutlineTrash size={28} style={{ color: "#027863" }} />
            </button>
            <CloseButton buttonFunction={cancelEdit} />
          </div>
          {presenteLabels.map((label, index) => {
            const fieldName = index === 0 ? "newName" : `newPresente0${index}`;
            const fieldValue =
              index === 0
                ? formData.newName || ""
                : formData[fieldName] !== undefined
                ? formData[fieldName]
                : verb.presente[`presente0${index}`] || "";
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
                  className="pl-6 w-full min-h-[2.8rem] col-span-3 border border-gray-300 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:border-2 focus:border-lightblue"
                />
              </div>
            );
          })}
          {error2 && <DefaultError errorMessage={error2} />}
          <DefaultButton
            buttonFunction={updateVerb}
            buttonText="Save"
            size="6rem"
          />
        </div>
      ) : (
        <DeleteModal
          verbId={verb._id}
          setCustomVerbs={setCustomVerbs}
          setFilteredVerbs={setFilteredVerbs}
          setDeleteModal={setDeleteModal}
          setEditModal={setEditModal}
          setError={setError}
        />
      )}
    </>
  );
}
