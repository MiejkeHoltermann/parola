import DefaultButton from "../DefaultButton";
import SimpleWordCard from "./SimpleWordCard";

// simply shows a list of all selected words so the user can memorize them

export default function PracticeList({ customWords, provideNewWord, reload }) {
  return (
    <>
      {customWords.length > 0 ? (
        <>
          <p className="text-center">Try to memorize these words.</p>
          {customWords.map((word) => (
            <SimpleWordCard
              key={word._id}
              englishWord={word.englishWord}
              italianWord={word.italianWord}
            />
          ))}
          <DefaultButton
            buttonFunction={provideNewWord}
            buttonType="button"
            buttonText="Practice now"
            size="10rem"
          />
        </>
      ) : (
        <>
          <p className="text-center">None of your words meet these criteria.</p>

          <DefaultButton
            buttonFunction={reload}
            buttonType="button"
            buttonText="Back"
          />
        </>
      )}
    </>
  );
}
