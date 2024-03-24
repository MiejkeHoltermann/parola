import { HiQuestionMarkCircle } from "react-icons/hi";

export default function Hint({ hint, setHint, activeVerb }) {
  function toggleHint() {
    setHint(!hint);
  }

  return (
    <div className="w-full flex items-center justify-end gap-[1rem] mt-[2rem]">
      {hint ? (
        <p className="text-mint font-bold text-end">
          {`${activeVerb.presente.presente01} - ${activeVerb.presente.presente02} - ${activeVerb.presente.presente03}`}
          <br />
          {`${activeVerb.presente.presente04} - ${activeVerb.presente.presente05} - ${activeVerb.presente.presente06}`}
        </p>
      ) : null}
      <button onClick={toggleHint} type="button" className="self-start">
        <HiQuestionMarkCircle size={40} style={{ color: "#027863" }} />
      </button>
    </div>
  );
}
