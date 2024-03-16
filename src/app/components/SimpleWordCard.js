import Image from "next/image";
import { FaHeart } from "react-icons/fa";

export default function SimpleWordCard({ germanWord, italianWord }) {
  return (
    <>
      <div className="w-[90%] flex flex-col rounded-xl shadow-[2px_2px_rgba(0,215,177,1)] px-4 py-2">
        <div className="relative w-full flex gap-4 pb-2">
          <Image
            src="/german-flag-round.svg"
            alt="german flag"
            width={100}
            height={100}
            className="w-6 h-6"
          />
          <p className="w-full break-all">{germanWord}</p>
        </div>
        <hr className="border-gray-300 w-full" />
        <div className="relative w-full flex gap-4 pt-2">
          <Image
            src="/italian-flag-round.svg"
            alt="italian flag"
            width={100}
            height={100}
            className="w-6 h-6"
          />
          <p className="w-full break-all">{italianWord}</p>
        </div>
      </div>
    </>
  );
}
