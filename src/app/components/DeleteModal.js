export default function DeleteModal({ closeDeleteModal, removeWord, wordId }) {
  return (
    <div>
      <p>Bist du sicher, dass du dieses Wort endgültig löschen möchtest?</p>
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={closeDeleteModal}
          className="w-[6rem] bg-lightmint rounded-md p-1"
        >
          Abbrechen
        </button>
        <button
          onClick={() => removeWord(wordId)}
          className="w-[6rem] bg-lightblue rounded-md p-1"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
