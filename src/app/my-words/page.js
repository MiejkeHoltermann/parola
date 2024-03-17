"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordCard from "../components/WordCard";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";
import SortingDropdown from "../components/SortingDropdown";
import FilterOptions from "../components/FilterOptions";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "../components/SearchBar";

export default function MyWords() {
  const [customWords, setCustomWords] = useState();
  const [filteredWords, setFilteredWords] = useState([]);
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const [filter, setFilter] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        return;
      } else {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}/words`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const { customWords } = await response.json();
          setCustomWords(customWords);
          setFilteredWords(customWords);
        } catch (error) {
          console.error("Error fetching data.", error);
        }
      }
    };
    if (status === "authenticated") {
      fetchData();
    }
  }, [session, status]);

  const sortWords = (sortBy, order) => {
    const sortedWords = [...filteredWords];
    sortedWords.sort((a, b) => {
      if (sortBy === "alphabet") {
        const wordA = a.germanWord.toLowerCase();
        const wordB = b.germanWord.toLowerCase();
        if (order === "asc") {
          return wordA.localeCompare(wordB);
        } else if (order === "desc") {
          return wordB.localeCompare(wordA);
        }
      } else if (sortBy === "level") {
        const levelA = a.level;
        const levelB = b.level;
        if (order === "asc") {
          return levelA - levelB;
        } else if (order === "desc") {
          return levelB - levelA;
        }
      }
      return 0;
    });
    setFilteredWords(sortedWords);
  };

  const handleChange = (e) => {
    try {
      const { checked } = e.target;
      const filteredWords = customWords.filter((word) => {
        const favoriteMatch = checked ? word.isFavorite : true;
        return favoriteMatch;
      });
      setFilteredWords(filteredWords);
      setFavorite(!favorite);
    } catch (error) {
      console.log("Error filtering data.", error);
    }
  };

  const resetFilters = async (e) => {
    e.preventDefault();
    if (!session) {
      return;
    } else {
      const userId = session.user.id;
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { customWords } = await response.json();
        setFilteredWords(customWords);
        e.target.form.reset();
        setFavorite(false);
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    }
  };

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
    <main>
      {status === "loading" ? (
        <div className="flex items-center justify-center h-screen">
          <Lottie loop animationData={lottieJson} play />
        </div>
      ) : (
        <div>
          {filteredWords && filteredWords.length > 0 ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">
                Meine Vokabeln ({filteredWords.length})
              </h2>
              <p className="text-center">
                Doppelklicke auf ein Wort, um es zu bearbeiten.
              </p>
            </div>
          ) : (
            <h2 className="mt-[2rem] text-xl font-bold">Vokabelliste</h2>
          )}
        </div>
      )}
      <div className="flex gap-1">
        <Link
          href="/wordform"
          alt="wordform"
          className="text-darkmint w-[1.6rem] h-[1.6rem] rounded-[50%] flex justify-center items-center mb-1"
        >
          <Image
            src="/plus.svg"
            alt="add button"
            width={80}
            height={80}
            className="w-[1rem] h-[1rem]"
          ></Image>
        </Link>
        <Link
          href="/wordform"
          alt="wordform"
          className="text-darkmint font-bold hover:underline hover:cursor-pointer"
        >
          Vokabeln hinzufügen
        </Link>
      </div>
      <SearchBar
        customWords={customWords}
        setFilteredWords={setFilteredWords}
        placeholder="Vokabeln suchen"
      />
      <div className="relative w-[90%]">
        <button
          onClick={() => (setFilter(!filter), setDropdown(false))}
          type="button"
          className="text-left w-[4rem]"
        >
          Filter
        </button>
        {filter && (
          <FilterOptions
            favorite={favorite}
            handleChange={handleChange}
            resetFilters={resetFilters}
          />
        )}
        <button
          onClick={() => (setDropdown(!dropdown), setFilter(false))}
          type="button"
          className="absolute top-0 right-0 flex justify-end items-center gap-2 w-[8rem]"
        >
          <p>Sortieren</p>
          <Image
            src="/arrow.svg"
            alt="arrow"
            width={100}
            height={100}
            className="w-4 h-4 flex justify-center align-center bg-blue-500"
          />
        </button>
        {dropdown && <SortingDropdown sortWords={sortWords} levels />}
      </div>
      {filteredWords.map((word) => (
        <WordCard
          key={word._id}
          wordId={word._id}
          isFavorite={word.isFavorite}
          germanWord={word.germanWord}
          italianWord={word.italianWord}
          setFilteredWords={setFilteredWords}
        />
      ))}
      <div>
        {filteredWords &&
        filteredWords.length === 0 &&
        customWords &&
        customWords.length > 0 ? (
          <p>Es konnten keine passenden Wörter gefunden werden.</p>
        ) : filteredWords &&
          filteredWords.length === 0 &&
          customWords &&
          customWords.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-center">
              Du hast keine Wörter gespeichert. Füge im Formular oben neue
              Wörter hinzu oder importiere den Grundwortschatz der App.
            </p>
            <button
              onClick={importWords}
              className="my-[1rem] bg-darkmint flex justify-center gap-2 text-white w-40 font-bold rounded-xl cursor-pointer px-6 py-2"
            >
              Importieren
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
