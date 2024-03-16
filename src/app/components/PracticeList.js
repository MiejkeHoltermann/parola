import DefaultButton from "./DefaultButton";
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
          <p className="text-center">Präge dir diese Wörter gut ein.</p>
          {customWords.map((word) => (
            <SimpleWordCard
              key={word._id}
              germanWord={word.germanWord}
              italianWord={word.italianWord}
            />
          ))}
          <DefaultButton
            buttonFunction={provideNewWord}
            buttonType="button"
            buttonText="Jetzt abfragen"
          />
        </>
      ) : (
        <>
          {level === null ? (
            <p>{`Du hast kein Level ausgewählt.`}</p>
          ) : (
            <p className="text-center">
              Du hast keine Vokabeln, die diese Kriterien erfüllen.
            </p>
          )}
          <DefaultButton
            buttonFunction={reload}
            buttonType="button"
            buttonText="Zurück"
          />
        </>
      )}
    </>
  );
}
