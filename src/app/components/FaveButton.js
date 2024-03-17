"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function FaveButton({ wordId, isFavorite, category }) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { data: session, status } = useSession();
  const userId = session.user.id;

  const addToFavorites = async () => {
    if (session) {
      setFavorite((prevFavorite) => !prevFavorite);
      const res = await fetch(`api/users/${userId}/${category}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, wordId }),
      });

      if (res.ok) {
        console.log("Successfully updated favorite settings.");
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
