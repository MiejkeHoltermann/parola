import Image from "next/image";
import DeleteButton from "./DeleteButton";

export default function WordList({ id, germanWord, italianWord }) {
  return (
    <ul key={id} className="w-full flex flex-col items-center">
      <li className="w-[90%] flex rounded-xl shadow-xl p-4">
        <div className="w-full">
          <div className="relative w-full flex gap-8 pb-4">
            <Image
              src="/german-flag-round.svg"
              alt="german flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <p className="w-full">{germanWord}</p>
          </div>
          <hr className="border-gray-300 w-full" />
          <div className="relative w-full flex gap-8 pt-4">
            <Image
              src="/italian-flag-round.svg"
              alt="italian flag"
              width={100}
              height={100}
              className="w-6 h-6"
            />
            <p className="w-full">{italianWord}</p>
          </div>
        </div>
        <DeleteButton id={id} />
      </li>
    </ul>
  );
}
