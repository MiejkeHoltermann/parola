import DefaultButton from "../DefaultButton";
import SimpleVerbCard from "./SimpleVerbCard";

// simply shows a list of all selected verbs so the user can memorize them

export default function PracticeList({ customVerbs, provideNewVerb, reload }) {
  return (
    <>
      {customVerbs.length > 0 ? (
        <>
          <p className="text-center">Präge dir diese Verben gut ein.</p>
          {customVerbs.map((verb) => (
            <SimpleVerbCard key={verb._id} verb={verb} />
          ))}
          <DefaultButton
            buttonFunction={provideNewVerb}
            buttonType="button"
            buttonText="Jetzt abfragen"
          />
        </>
      ) : (
        <>
          <p className="text-center">
            Du hast keine Verben, die diese Kriterien erfüllen.
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
