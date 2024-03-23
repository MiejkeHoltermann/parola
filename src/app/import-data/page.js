"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "../components/DefaultButton";
import DefaultCheckbox from "../components/DefaultCheckbox";

export default function ImportData() {
  const [importData, setImportData] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (session && importData) {
        const userId = session.user.id;
        await fetch("api/importWords", {
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
      <p className="w-full text-center">
        Diese App stellt einen umfangreichen Grundwortschatz zur Verfügung.
        <br />
        Entferne das Häkchen, wenn du stattdessen deine eigenen Vokabeln
        hinzufügen möchtest. <br />
        <br />
        Du kannst den Grundwortschatz auch später hinzufügen, wenn du noch
        unsicher bist.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-[90%] flex flex-col items-center mt-[1rem] gap-[4rem]"
      >
        <DefaultCheckbox
          setValue={setImportData}
          defaultChecked
          checkboxId="importData"
          checkboxName="importData"
          checkboxValue="importData"
          checkboxLabel="Wortschatz importieren"
        />
        <DefaultButton buttonType="submit" buttonText="OK" />
      </form>
    </main>
  );
}
