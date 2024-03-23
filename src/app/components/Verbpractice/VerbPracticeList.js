import DefaultButton from "../DefaultButton";
import SimpleVerbCard from "./SimpleVerbCard";

export default function VerbPracticeList({
  customVerbs,
  provideNewVerb,
  reload,
}) {
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
          {level === null ? (
            <p>{`Du hast kein Level ausgewählt.`}</p>
          ) : (
            <p className="text-center">
              Du hast keine Verben, die diese Kriterien erfüllen.
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
