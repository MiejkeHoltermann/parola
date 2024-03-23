import { useSession } from "next-auth/react";
import DefaultButton from "./DefaultButton";

export default function ImportButton({ setCustomWords, setFilteredWords }) {
  const { data: session, status } = useSession();

  const importWords = async () => {
    if (!session) {
      return;
    } else {
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
        setCustomWords(customWords);
        setFilteredWords(customWords);
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    }
  };

  return (
    <DefaultButton
      buttonFunction={importWords}
      buttonType="button"
      buttonText="Importieren"
    />
  );
}
