import { useSession } from "next-auth/react";
import DefaultButton from "./DefaultButton";

export default function ImportButton({
  setCustomWords,
  setFilteredWords,
  setError,
}) {
  const { data: session, status } = useSession();

  const importWords = async () => {
    if (session) {
      const userId = session.user.id;
      try {
        const response = await fetch("api/importWords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const { customWords } = await response.json();
        if (customWords) {
          setCustomWords(customWords);
          setFilteredWords(customWords);
          setError("");
        } else {
          setError("Error importing data");
        }
      } catch (error) {
        setError("Error importing data");
      }
    }
  };

  return (
    <DefaultButton
      buttonFunction={importWords}
      buttonType="button"
      buttonText="Import"
    />
  );
}
