"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordCard from "../components/WordCard";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";
import SortingDropdown from "../components/SortingDropdown";
import FilterOptions from "../components/FilterOptions";
import Image from "next/image";
import { HiDocumentAdd } from "react-icons/hi";
import WordForm from "../components/WordForm";

export default function WordFormPage() {
  const [customWords, setCustomWords] = useState();
  const [filteredWords, setFilteredWords] = useState([]);
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const [filter, setFilter] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [wordForm, setWordForm] = useState(false);
  const [newWord, setNewWord] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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

  const toggleWordForm = () => {
    setWordForm(true);
  };

  return (
    <main>
      {wordForm ? (
        <WordForm
          toggleWordForm={toggleWordForm}
          setNewWord={setNewWord}
          setCustomWords={setCustomWords}
        />
      ) : (
        <HiDocumentAdd
          onClick={toggleWordForm}
          size={32}
          className="ml-auto text-[rgba(2,120,99,1)]"
        />
      )}
      {status === "loading" ? (
        <div className="flex items-center justify-center h-screen">
          <Lottie loop animationData={lottieJson} play />
        </div>
      ) : (
        <div>
          {filteredWords && filteredWords.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-center">
                Vokabelliste (
                {filteredWords.length === 1
                  ? `${filteredWords.length} Wort`
                  : `${filteredWords.length} Wörter`}
                )
              </h2>
              <p className="text-center">
                Doppelklicke auf ein Wort, um es zu bearbeiten.
              </p>
            </>
          ) : (
            <h2 className="mt-[2rem] text-xl font-bold">Vokabelliste</h2>
          )}
        </div>
      )}
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
        {dropdown && <SortingDropdown sortWords={sortWords} />}
      </div>
      {filteredWords.map((word) => (
        <WordCard
          key={word._id}
          wordId={word._id}
          isFavorite={word.isFavorite}
          germanWord={word.germanWord}
          italianWord={word.italianWord}
          newWord={newWord}
          setFilteredWords={setFilteredWords}
        />
      ))}
      <div>
        {filteredWords && filteredWords.length === 0 ? (
          <>
            <p>
              Du hast keine Wörter gespeichert. Füge im Formular oben neue
              Wörter hinzu oder importiere{" "}
              <button className="underline">hier</button> den Grundwortschatz
              der App.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
