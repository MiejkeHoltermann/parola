import { useState } from "react";
import { useSession } from "next-auth/react";
import FaveButton from "./FaveButton";
import { RiEdit2Fill } from "react-icons/ri";
import VerbEditModal from "./VerbEditModal";
import { useSWRConfig } from "swr";

export default function VerbCard({ verb, isFavorite, setFilteredVerbs }) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(verb.name);
  const [newPresente01, setNewPresente01] = useState(verb.presente.presente01);
  const [newPresente02, setNewPresente02] = useState(verb.presente.presente02);
  const [newPresente03, setNewPresente03] = useState(verb.presente.presente03);
  const [newPresente04, setNewPresente04] = useState(verb.presente.presente04);
  const [newPresente05, setNewPresente05] = useState(verb.presente.presente05);
  const [newPresente06, setNewPresente06] = useState(verb.presente.presente06);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const { mutate } = useSWRConfig({
    revalidateOnFocus: true,
  });
  const presenteLabels = ["io", "tu", "lei/lui", "noi", "voi", "loro"];

  const updateVerb = async () => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else if (newName.length === 0 || newPresente01.length === 0) {
      setError("Alle Felder müssen ausgefüllt sein.");
      return;
    } else {
      const userId = session.user.id;
      const verbId = verb._id;
      const res = await fetch(`api/users/${userId}/verbs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          verbId,
          newName,
          newPresente01,
          newPresente02,
          newPresente03,
          newPresente04,
          newPresente05,
          newPresente06,
        }),
      });
      if (res.ok) {
        console.log("Successfully updated verb.");
        setNewPresente01("");
        mutate(`api/updateVerb`);
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
              wordId={verb._id}
              isFavorite={verb.isFavorite}
              category="verbs"
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
          <VerbEditModal
            verbId={verb._id}
            setEditMode={setEditMode}
            name={verb.name}
            newName={newName}
            newPresente01={newPresente01}
            newPresente02={newPresente02}
            newPresente03={newPresente03}
            newPresente04={newPresente04}
            newPresente05={newPresente05}
            newPresente06={newPresente06}
            presente01={verb.presente.presente01}
            presente02={verb.presente.presente02}
            presente03={verb.presente.presente03}
            presente04={verb.presente.presente04}
            presente05={verb.presente.presente05}
            presente06={verb.presente.presente06}
            setNewName={setNewName}
            setNewPresente01={setNewPresente01}
            setNewPresente02={setNewPresente02}
            setNewPresente03={setNewPresente03}
            setNewPresente04={setNewPresente04}
            setNewPresente05={setNewPresente05}
            setNewPresente06={setNewPresente06}
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
