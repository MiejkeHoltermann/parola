import DefaultButton from "../DefaultButton";
import SimpleVerbCard from "./SimpleVerbCard";

// simply shows a list of all selected verbs so the user can memorize them

export default function PracticeList({ customVerbs, provideNewVerb, reload }) {
  return (
    <>
      {customVerbs.length > 0 ? (
        <>
          <p className="text-center">Try to memorize these verbs.</p>
          {customVerbs.map((verb) => (
            <SimpleVerbCard key={verb._id} verb={verb} />
          ))}
          <DefaultButton
            buttonFunction={provideNewVerb}
            buttonType="button"
            buttonText="Practice now"
            size="10rem"
          />
        </>
      ) : (
        <>
          <p className="text-center">None of your verbs meet these criteria.</p>
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
