import Link from "next/link";

export default function DefaultLink({ link, linkText }) {
  return (
    <Link
      href={link}
      className="bg-darkblue w-[60%] text-white text-center font-bold cursor-pointer rounded-lg px-[1.4rem] py-[0.6rem] hover:scale-105"
    >
      {linkText}
    </Link>
  );
}
