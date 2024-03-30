import { useState } from "react";
import FaveButton from "./FaveButton";
import EditModal from "./EditModal";
import { RiEdit2Fill } from "react-icons/ri";

export default function VerbCard({
  verb,
  setCustomVerbs,
  setFilteredVerbs,
  setError,
}) {
  const [editModal, setEditModal] = useState(false);
  const presenteLabels = ["io", "tu", "lei/lui", "noi", "voi", "loro"];

  return (
    <>
      {!editModal ? (
        // renders the normal VerbCard
        <div className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-2 hover:scale-105">
          <div className="flex items-center mt-[0.3rem] gap-[0.6rem]">
            <p className="w-full break-all font-bold">{verb.name}</p>
            <button onClick={() => setEditModal(true)}>
              <RiEdit2Fill size={20} />
            </button>
            <FaveButton
              verbId={verb._id}
              isFavorite={verb.isFavorite}
              setCustomVerbs={setCustomVerbs}
              setError={setError}
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
        // renders the VerbCard in editing mode
        <div className="relative w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-4">
          <EditModal
            verb={verb}
            setCustomVerbs={setCustomVerbs}
            setFilteredVerbs={setFilteredVerbs}
            setEditModal={setEditModal}
            setError={setError}
          />
        </div>
      )}
    </>
  );
}
