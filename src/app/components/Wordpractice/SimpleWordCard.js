import Image from "next/image";

export default function SimpleWordCard({ englishWord, italianWord }) {
  return (
    <>
      <div className="w-[80%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-[1rem] py-[0.6rem]">
        <div className="w-full flex gap-[1rem] pb-[0.6rem]">
          <Image
            src="/british-flag.svg"
            alt="british flag"
            width={50}
            height={50}
            className="w-[1.6rem] h-[1.6rem]"
          />
          <p className="w-full">{englishWord}</p>
        </div>
        <hr className="border-gray-300 w-full" />
        <div className="w-full flex gap-[1rem] pt-[0.6rem]">
          <Image
            src="/italian-flag.svg"
            alt="italian flag"
            width={50}
            height={50}
            className="w-[1.6rem] h-[1.6rem"
          />
          <p className="w-full">{italianWord}</p>
        </div>
      </div>
    </>
  );
}
