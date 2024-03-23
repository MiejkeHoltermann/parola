import { useSession } from "next-auth/react";
import DefaultButton from "../DefaultButton";

export default function DeleteModal({
  wordId,
  setFilteredWords,
  toggleDeleteModal,
  setEditMode,
}) {
  const { data: session } = useSession();

  const removeWord = async (wordId) => {
    if (!session) {
      return <div>You are not logged in.</div>;
    } else {
      const userId = session.user.id;
      const response = await fetch(`api/users/${userId}/words`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, wordId }),
      });
      const { newCustomWords } = await response.json();
      if (newCustomWords) {
        setFilteredWords(newCustomWords);
      }
      toggleDeleteModal;
      setEditMode(false);
    }
  };

  return (
    <div>
      <p className="text-center">
        Bist du sicher, dass du dieses Wort endgültig löschen möchtest?
      </p>
      <div className="flex justify-center gap-[1rem] mt-[0.6rem]">
        <DefaultButton
          buttonFunction={toggleDeleteModal}
          buttonType="button"
          buttonText="Nein"
          smallSize="6rem"
          color="red"
        />
        <DefaultButton
          buttonFunction={() => removeWord(wordId)}
          buttonType="button"
          buttonText="Ja"
          smallSize="6rem"
        />
      </div>
    </div>
  );
}
