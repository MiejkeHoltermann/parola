import Link from "next/link";

export default function DefaultLink({ link, linkText }) {
  return (
    <Link
      href={link}
      className="bg-darkblue w-[36vw] h-[30vw] text-white text-center text-sm font-bold cursor-pointer rounded-lg px-6 py-2"
    >
      {linkText}
    </Link>
  );
}
