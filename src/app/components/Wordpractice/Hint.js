import { HiQuestionMarkCircle } from "react-icons/hi";

export default function Hint({ hint, setHint, activeWord }) {
  function toggleHint() {
    setHint(!hint);
  }

  return (
    <div className=" w-full flex items-center justify-end mt-[2rem] gap-[0.6rem]">
      {hint ? (
        <p className="text-mint font-bold">{activeWord.italianWord}</p>
      ) : null}
      <button onClick={toggleHint} type="button" className="hover:scale-110">
        <HiQuestionMarkCircle size={40} style={{ color: "#027863" }} />
      </button>
    </div>
  );
}
