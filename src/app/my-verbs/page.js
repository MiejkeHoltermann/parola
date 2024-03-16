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
import VerbCard from "../components/VerbCard";

export default function MyVerbs() {
  const [customVerbs, setCustomVerbs] = useState();
  const [filteredVerbs, setFilteredVerbs] = useState([]);
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
          const response = await fetch(`/api/users/${userId}/verbs`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const { customVerbs } = await response.json();
          setCustomVerbs(customVerbs);
          setFilteredVerbs(customVerbs);
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
    const sortedVerbs = [...filteredVerbs];
    sortedVerbs.sort((a, b) => {
      if (sortBy === "alphabet") {
        const wordA = a.name.toLowerCase();
        const wordB = b.name.toLowerCase();
        if (order === "asc") {
          return wordA.localeCompare(wordB);
        } else if (order === "desc") {
          return wordB.localeCompare(wordA);
        }
      }
      return 0;
    });
    setFilteredVerbs(sortedVerbs);
  };

  const handleChange = (e) => {
    try {
      const { checked } = e.target;
      const filteredVerbs = customVerbs.filter((verb) => {
        const favoriteMatch = checked ? verb.isFavorite : true;
        return favoriteMatch;
      });
      setFilteredVerbs(filteredVerbs);
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
        const { customVerbs } = await response.json();
        setFilteredVerbs(customVerbs);
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
        const { customVerbs } = await response.json();
        setCustomVerbs(customVerbs);
        setFilteredVerbs(customVerbs);
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
          {filteredVerbs && filteredVerbs.length > 0 ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">
                Meine Verben ({filteredVerbs.length})
              </h2>
              <p className="text-center">
                Doppelklicke auf ein Verb, um es zu bearbeiten.
              </p>
            </div>
          ) : (
            <h2 className="mt-[2rem] text-xl font-bold">Verbliste</h2>
          )}
        </div>
      )}
      <div className="flex gap-1">
        <Link
          href="/verbform"
          alt="verbform"
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
          href="/verbform"
          alt="verbform"
          className="text-darkmint font-bold hover:underline hover:cursor-pointer"
        >
          Verben hinzufügen
        </Link>
      </div>
      <SearchBar
        customVerbs={customVerbs}
        setFilteredVerbs={setFilteredVerbs}
        placeholder="Verben suchen"
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
        {dropdown && <SortingDropdown sortWords={sortWords} />}
      </div>
      {filteredVerbs.map((verb) => (
        <VerbCard
          key={verb._id}
          verb={verb}
          isFavorite={verb.isFavorite}
          setFilteredVerbs={setFilteredVerbs}
        />
      ))}
      <div>
        {filteredVerbs &&
        filteredVerbs.length === 0 &&
        customVerbs &&
        customVerbs.length > 0 ? (
          <p>Es konnten keine passenden Wörter gefunden werden.</p>
        ) : filteredVerbs &&
          filteredVerbs.length === 0 &&
          customVerbs &&
          customVerbs.length === 0 ? (
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
