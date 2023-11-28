import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1 className="text-darkgreen text-3xl font-bold">Benvenuto!</h1>
      <p>Was möchtest du heute machen?</p>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/wordform"
      >
        Vokabeln hinzufügen
      </Link>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/wordlist"
      >
        Vokabeln üben
      </Link>
      <Link
        className="rounded-xl py-2 px-8 bg-gray-300 text-center w-64"
        href="/wordpractise"
      >
        Vokabeln prüfen
      </Link>
    </main>
  );
}
