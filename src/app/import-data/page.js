"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "../components/DefaultButton";
import DefaultCheckbox from "../components/DefaultCheckbox";
import DefaultError from "../components/DefaultError";
import LoadingAnimation from "../components/LoadingAnimation";
import CloseLink from "../components/CloseLink";

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
        const { message } = await response.json();
        if (response.ok) {
          router.push("/home");
        } else if (message === "Words already imported") {
          setLoading(false);
          setError("You already imported the vocabulary.");
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
      <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
        {status === "loading" ? (
          <LoadingAnimation />
        ) : (
          <>
            <CloseLink href="/home" />
            <p className="w-[80%] text-center">
              This app provides a comprehensive vocabulary to get you started.
              <br />
              Untick the box if you want to add your own words instead. <br />
              <br />
              You can import the vocabulary later, if you are not sure yet.
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
                checkboxLabel="Import vocabulary"
              />
              {loading && <LoadingAnimation small />}
              {error && <DefaultError errorMessage={error} />}
              <DefaultButton buttonType="submit" buttonText="OK" size="6rem" />
            </form>
          </>
        )}
      </div>
    </main>
  );
}
