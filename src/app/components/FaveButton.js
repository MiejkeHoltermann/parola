"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function FaveButton({
  wordId,
  isFavorite,
  category,
  setCustomWords,
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { data: session, status } = useSession();
  const userId = session.user.id;

  const addToFavorites = async () => {
    if (session) {
      setFavorite((prevFavorite) => !prevFavorite);
      const response = await fetch(`api/users/${userId}/${category}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, wordId }),
      });
      const { newCustomWords } = await response.json();
      if (newCustomWords) {
        setCustomWords(newCustomWords);
      } else {
        console.log("Error updating favorite settings.");
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
