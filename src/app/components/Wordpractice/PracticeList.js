import DefaultButton from "../DefaultButton";
import SimpleWordCard from "./SimpleWordCard";

// simply shows a list of all selected words so the user can memorize them

export default function PracticeList({ customWords, provideNewWord, reload }) {
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
          <p className="text-center">
            Du hast keine Vokabeln, die diese Kriterien erfüllen.
          </p>
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
