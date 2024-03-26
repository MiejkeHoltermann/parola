import { useSession } from "next-auth/react";
import DefaultButton from "../DefaultButton";

export default function DeleteModal({
  verbId,
  setCustomVerbs,
  setFilteredVerbs,
  setEditModal,
  setDeleteModal,
  setError,
}) {
  const { data: session } = useSession();

  const removeVerb = async (verbId) => {
    if (session) {
      const userId = session.user.id;
      try {
        // deletes a verb from the database
        const response = await fetch(`api/users/${userId}/verbs`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, verbId }),
        });
        const { customVerbs } = await response.json();
        if (customVerbs) {
          setCustomVerbs(customVerbs);
          setFilteredVerbs(customVerbs);
          setError("");
        } else {
          setError("Error deleting verb");
        }
      } catch (error) {
        setError("Error deleting verb");
      }
      setDeleteModal(false);
      setEditModal(false);
    }
  };

  return (
    <div>
      <p className="text-center">Are you sure, you want to delete this verb?</p>
      <div className="flex justify-center gap-[1rem] mt-[0.6rem]">
        <DefaultButton
          buttonFunction={() => setDeleteModal(false)}
          buttonType="button"
          buttonText="No"
          size="6rem"
          color="red"
        />
        <DefaultButton
          buttonFunction={() => removeVerb(verbId)}
          buttonType="button"
          buttonText="Yes"
          size="6rem"
        />
      </div>
    </div>
  );
}
