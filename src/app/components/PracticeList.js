import SimpleWordCard from "./SimpleWordCard";

export default function PracticeList({
  level,
  customWords,
  provideNewWord,
  reload,
}) {
  return (
    <>
      {customWords.length > 0 ? (
        <>
          {customWords.map((word) => (
            <SimpleWordCard
              key={word._id}
              isFavorite={word.isFavorite}
              germanWord={word.germanWord}
              italianWord={word.italianWord}
            />
          ))}
          <button
            onClick={provideNewWord}
            className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
          >
            Frag mich ab
          </button>
        </>
      ) : (
        <>
          {level === null ? (
            <p>{`Du hast kein Level ausgewählt.`}</p>
          ) : level === "all" ? (
            <p>{`Du hast keine Wörter gespeichert.`}</p>
          ) : (
            <p>{`Du hast keine Wörter auf Level ${level}.`}</p>
          )}
          <button
            onClick={reload}
            className="bg-gray-800 flex justify-center gap-2 text-white w-60 font-bold rounded-xl cursor-pointer px-6 py-2"
          >
            Zurück
          </button>
        </>
      )}
    </>
  );
}
