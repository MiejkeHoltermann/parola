"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function FaveButton({
  wordId,
  isFavorite,
  setCustomWords,
  setError,
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { data: session, status } = useSession();

  const addToFavorites = async () => {
    if (session) {
      const userId = session.user.id;
      setFavorite((prevFavorite) => !prevFavorite);
      try {
        const response = await fetch(`api/users/${userId}/words`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, wordId }),
        });
        const { newCustomWords } = await response.json();
        if (newCustomWords) {
          setCustomWords(newCustomWords);
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
