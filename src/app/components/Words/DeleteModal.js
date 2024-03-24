import { useSession } from "next-auth/react";
import DefaultButton from "../DefaultButton";

export default function DeleteModal({
  wordId,
  setCustomWords,
  setFilteredWords,
  setDeleteModal,
  setEditModal,
  setError,
}) {
  const { data: session } = useSession();

  const removeWord = async (wordId) => {
    if (session) {
      const userId = session.user.id;
      try {
        // deletes a word from the database
        const response = await fetch(`api/users/${userId}/words`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, wordId }),
        });
        const { customWords } = await response.json();
        console.log(customWords);
        if (customWords) {
          setCustomWords(customWords);
          setFilteredWords(customWords);
          setError("");
        } else {
          setError("Error deleting word");
        }
      } catch (error) {
        setError("Error deleting word");
      }
      setDeleteModal(false);
      setEditModal(false);
    }
  };

  return (
    <div>
      <p className="text-center">
        Bist du sicher, dass du dieses Wort endgültig löschen möchtest?
      </p>
      <div className="flex justify-center gap-[1rem] mt-[0.6rem]">
        <DefaultButton
          buttonFunction={() => setDeleteModal(false)}
          buttonType="button"
          buttonText="Nein"
          size="6rem"
          color="red"
        />
        <DefaultButton
          buttonFunction={() => removeWord(wordId)}
          buttonType="button"
          buttonText="Ja"
          size="6rem"
        />
      </div>
    </div>
  );
}
