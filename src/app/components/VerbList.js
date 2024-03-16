import DefaultButton from "./DefaultButton";
import VerbCard from "./VerbCard";

export default function VerbList({ provideNewVerb, customVerbs, reload }) {
  return (
    <>
      {customVerbs.length > 0 ? (
        <>
          <p className="text-center">
            Präge dir die Verben und ihre Zeitformen gut ein.
          </p>
          {customVerbs.map((verb) => (
            <VerbCard key={verb._id} verb={verb} />
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
