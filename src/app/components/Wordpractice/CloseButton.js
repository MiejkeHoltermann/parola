import Image from "next/image";

export default function CloseButton({ buttonFunction }) {
  return (
    <button
      onClick={buttonFunction}
      className="ml-auto bg-mint flex justify-center items-center text-white w-[1.6rem] h-[1.6rem] rounded-md"
    >
      <Image
        src="/cross.svg"
        alt="close button"
        width={50}
        height={50}
        className="w-[1.5rem] h-[1.5rem]"
      ></Image>
    </button>
  );
}
