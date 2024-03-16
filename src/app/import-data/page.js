"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "../components/DefaultButton";
import DefaultCheckbox from "../components/DefaultCheckbox";

export default function ImportData() {
  const [importData, setImportData] = useState(true);
  const [checked, setChecked] = useState(true);
  const { data: session } = useSession();

  const router = useRouter();

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
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
      <p className="w-full text-center bg-blue-500 text-blue-500">
        Diese App stellt einen umfangreichen Grundwortschatz zur Verfügung.
        <br />
        Entferne das Häkchen, wenn du stattdessen deine eigenen Vokabeln
        hinzufügen möchtest. <br />
        <br />
        Du kannst den Grundwortschatz auch später hinzufügen, wenn du noch
        unsicher bist.
      </p>
      <form className="w-[100%] flex flex-col items-center mt-[1rem] gap-[4rem]">
        <DefaultCheckbox
          checkboxId="importData"
          checkboxName="importData"
          checkboxValue="importData"
          checkboxLabel="Wortschatz importieren"
          onChange={handleCheckboxChange}
          checked={checked}
          defaultChecked={true}
        />
        <DefaultButton buttonFunction={handleSubmit} buttonText="OK" />
      </form>
    </main>
  );
}
