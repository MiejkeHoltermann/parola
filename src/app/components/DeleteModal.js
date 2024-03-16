export default function DeleteModal({ closeDeleteModal, removeWord, wordId }) {
  return (
    <div>
      <p className="text-center">
        Bist du sicher, dass du dieses Wort endgültig löschen möchtest?
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={closeDeleteModal}
          className="bg-red-400 w-[6em] text-white text-center font-bold cursor-pointer rounded-lg px-[0.2rem] py-[0.3rem] mt-[0.4rem]"
        >
          Nein
        </button>
        <button
          onClick={() => removeWord(wordId)}
          className="bg-mint w-[6rem] text-white text-center font-bold cursor-pointer rounded-lg px-[0.2rem] py-[0.3rem] mt-[0.4rem]"
        >
          Ja
        </button>
      </div>
    </div>
  );
}
