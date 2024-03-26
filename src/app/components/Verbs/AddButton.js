import Image from "next/image";

export default function AddButton({ toggleAddModal }) {
  return (
    <div className="flex items-center gap-[0.1rem] mt-[1rem] mr-[0.6rem]">
      <button
        onClick={toggleAddModal}
        className="text-mint w-[1.6rem] h-[1.6rem] flex justify-center items-center"
      >
        <Image
          src="/plus2.svg"
          alt="add button"
          width={80}
          height={80}
          className="w-[1rem] h-[1rem]"
        ></Image>
      </button>
      <button onClick={toggleAddModal} className="text-mint font-bold">
        Add verbs
      </button>
    </div>
  );
}
