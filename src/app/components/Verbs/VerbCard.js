import { useState } from "react";
import { useSession } from "next-auth/react";
import FaveButton from "./FaveButton";
import { RiEdit2Fill } from "react-icons/ri";
import EditModal from "./EditModal";

export default function VerbCard({ verb, setFilteredVerbs, setCustomVerbs }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    newName: verb.name,
    newPresente01: verb.presente.presente01,
    newPresente02: verb.presente.presente02,
    newPresente03: verb.presente.presente03,
    newPresente04: verb.presente.presente04,
    newPresente05: verb.presente.presente05,
    newPresente06: verb.presente.presente06,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const presenteLabels = ["io", "tu", "lei/lui", "noi", "voi", "loro"];

  const updateVerb = async () => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    } else {
      const userId = session.user.id;
      const verbId = verb._id;
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
      const { newCustomVerbs } = await response.json();
      if (newCustomVerbs) {
        setCustomVerbs(newCustomVerbs);
        setFilteredVerbs(newCustomVerbs);
      } else {
        console.log("Error updating verb.");
      }
    }
    setEditMode(false);
  };

  const removeVerb = async (verbId) => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else {
      const userId = session.user.id;
      const res = await fetch(`api/users/${userId}/verbs`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, verbId }),
      });
      const { newCustomVerbs } = await res.json();
      if (res.ok) {
        setFilteredVerbs(newCustomVerbs);
      }
      setDeleteModal(false);
      setEditMode(false);
    }
  };

  return (
    <>
      {!editMode ? (
        <div className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-2">
          <div className="flex items-center mt-[0.3rem] gap-[0.6rem]">
            <p className="w-full break-all font-bold">{verb.name}</p>
            <button onClick={() => setEditMode(true)}>
              <RiEdit2Fill size={20} />
            </button>
            <FaveButton
              verbId={verb._id}
              isFavorite={verb.isFavorite}
              setCustomVerbs={setCustomVerbs}
            />
          </div>
          <hr className="border-gray-300 w-full my-[0.6rem]" />
          {Object.keys(verb.presente).map((key, index) => (
            <div key={key} className="grid grid-cols-3">
              <p>{presenteLabels[index]}</p>
              <p className="w-full break-all col-span-2">
                {verb.presente[key]}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4">
          <EditModal
            verb={verb}
            setEditMode={setEditMode}
            formData={formData}
            setFormData={setFormData}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            removeVerb={removeVerb}
            updateVerb={updateVerb}
            error={error}
            setError={setError}
          />
        </div>
      )}
    </>
  );
}
