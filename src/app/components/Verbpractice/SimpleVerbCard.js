export default function VerbCard({ verb }) {
  const presenteLabels = ["io", "tu", "lei/lui", "noi", "voi", "loro"];

  return (
    <>
      <div className="w-[80%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-2">
        <p className="w-full mt-[0.3rem] break-all font-bold">{verb.name}</p>
        <hr className="border-gray-300 w-full my-[0.6rem]" />
        {Object.keys(verb.presente).map((key, index) => (
          <div key={key} className="grid grid-cols-3 gap-[2rem]">
            <p>{presenteLabels[index]}</p>
            <p className="w-full break-all col-span-2">{verb.presente[key]}</p>
          </div>
        ))}
      </div>
    </>
  );
}
