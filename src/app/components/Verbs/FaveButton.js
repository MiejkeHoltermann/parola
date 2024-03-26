"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function FaveButton({
  verbId,
  isFavorite,
  setCustomVerbs,
  setError,
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { data: session } = useSession();

  const addToFavorites = async () => {
    if (session) {
      const userId = session.user.id;
      setFavorite((prevFavorite) => !prevFavorite);
      try {
        const response = await fetch(`api/users/${userId}/verbs`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, verbId }),
        });
        const { newCustomVerbs } = await response.json();
        if (newCustomVerbs) {
          setCustomVerbs(newCustomVerbs);
          setError("");
        } else {
          setError("Error updating favorite settings");
        }
      } catch (error) {
        setError("Error updating favorite settings");
      }
    }
  };

  return (
    <button onClick={addToFavorites}>
      <FaHeart
        size={20}
        style={{
          color: favorite ? "rgba(2,120,99,1)" : "lightgray",
        }}
      />
    </button>
  );
}
