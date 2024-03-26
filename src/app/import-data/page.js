"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "../components/DefaultButton";
import DefaultCheckbox from "../components/DefaultCheckbox";
import DefaultError from "../components/DefaultError";
import LoadingAnimation from "../components/LoadingAnimation";

export default function ImportData() {
  const [importData, setImportData] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCheckboxChange = (e) => {
    setImportData(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if the importData checkbox is checked the default vocabulary is added to the user account
    if (session && importData) {
      const userId = session.user.id;
      setError("");
      setLoading(true);
      try {
        const response = await fetch("api/importWords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (response.ok) {
          router.push("/home");
        } else {
          setLoading(false);
          setError("Error importing data. Please untick the checkbox.");
        }
      } catch (error) {
        setLoading(false);
        setError("Error importing data. Please untick the checkbox.");
      }
    } else {
      router.push("/home");
    }
  };

  return (
    <main>
      <div
        className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl
flex flex-col items-center py-[2rem] gap-[1.6rem] mt-[10vh] mb-[6vh]"
      >
        {status === "loading" ? (
          <LoadingAnimation />
        ) : (
          <>
            <p className="w-[90%] text-center">
              Diese App stellt einen umfangreichen Grundwortschatz zur
              Verfügung.
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
                checked={importData}
                onChange={handleCheckboxChange}
                checkboxId="importData"
                checkboxName="importData"
                checkboxLabel="Wortschatz importieren"
              />
              {loading && <LoadingAnimation small />}
              {error && <DefaultError errorMessage={error} />}
              <DefaultButton buttonType="submit" buttonText="OK" size="8rem" />
            </form>
          </>
        )}
      </div>
    </main>
  );
}
