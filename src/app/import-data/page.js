"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ImportData() {
  const [importData, setImportData] = useState(true);
  const { data: session } = useSession();

  const router = useRouter();

  const handleCheckboxChange = (e) => {
    setImportData(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (session && importData === true) {
        const userId = session.user.id;
        await fetch("api/users/${userId}", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
      }
      router.push("/");
    } catch (error) {
      console.log("Error importing data.", error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-80">
        <p className="w-80">
          Diese App stellt einen umfangreichen Grundwortschatz zur Verfügung.
          Entferne das Häkchen, wenn du stattdessen deine eigenen Vokabeln
          hinzufügen möchtest. Du kannst den Grundwortschatz auch später
          hinzufügen, wenn du noch unsicher bist.
        </p>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="import"
            name="import"
            value="importData"
            checked={importData}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="import">Wortschatz importieren</label>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2"
        >
          Fortfahren
        </button>
      </form>
    </main>
  );
}
