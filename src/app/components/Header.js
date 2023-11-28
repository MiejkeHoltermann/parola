import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white fixed top-0 left-0 h-16 w-full flex justify-end items-center gap-6 px-5">
      <Link className="w-8 h-8 mx-2 bg-transparent" href="/login">
        <Image
          className="w-8 h-8"
          src="/profile-button.svg"
          alt="profile button"
          width={100}
          height={100}
        />
      </Link>
    </header>
  );
}
