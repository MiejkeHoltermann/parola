"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WordCard from "../components/Words/WordCard";
import SortingOptions from "../components/Words/SortingOptions";
import FilterOptions from "../components/Words/FilterOptions";
import SearchBar from "../components/Words/SearchBar";
import LoadingAnimation from "../components/LoadingAnimation";
import ImportButton from "../components/ImportButton";
import WordForm from "../components/Words/WordForm";
import AddButton from "../components/Words/AddButton";
import CloseLink from "../components/CloseLink";

export default function Words() {
  const [customWords, setCustomWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [filterDialogue, setFilterDialogue] = useState(false);
  const [sortingDialogue, setSortingDialogue] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [addModal, setAddModal] = useState(false);

  const { data: session, status } = useSession();

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

  const resetFilters = async () => {
    setFilteredWords(customWords);
    setFilterDialogue(false);
    setSelectedLevel("all");
  };

  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : customWords ? (
        <>
          {addModal ? (
            <WordForm
              toggleAddModal={toggleAddModal}
              setCustomWords={setCustomWords}
              setFilteredWords={setFilteredWords}
            />
          ) : (
            <>
              <CloseLink href="/home" />
              <h1 className="text-xl font-bold">
                Meine Vokabeln ({customWords.length})
              </h1>
              <AddButton toggleAddModal={toggleAddModal} />{" "}
              {customWords.length > 0 ? (
                <>
                  <SearchBar
                    customWords={customWords}
                    setFilteredWords={setFilteredWords}
                    placeholder="Vokabeln suchen"
                  />
                  <div className="relative w-[90%]">
                    <FilterOptions
                      customWords={customWords}
                      setFilteredWords={setFilteredWords}
                      filterDialogue={filterDialogue}
                      setFilterDialogue={setFilterDialogue}
                      setSortingDialogue={setSortingDialogue}
                      selectedLevel={selectedLevel}
                      setSelectedLevel={setSelectedLevel}
                      resetFilters={resetFilters}
                    />
                    <SortingOptions
                      customWords={customWords}
                      filteredWords={filteredWords}
                      setFilteredWords={setFilteredWords}
                      sortingDialogue={sortingDialogue}
                      setSortingDialogue={setSortingDialogue}
                      setFilterDialogue={setFilterDialogue}
                    />
                  </div>
                  {filteredWords.length > 0 ? (
                    <>
                      {filteredWords.map((word) => (
                        <WordCard
                          key={word._id}
                          wordId={word._id}
                          isFavorite={word.isFavorite}
                          germanWord={word.germanWord}
                          italianWord={word.italianWord}
                          setFilteredWords={setFilteredWords}
                          setCustomWords={setCustomWords}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="text-center">Keine Treffer</p>
                      <button
                        onClick={() => resetFilters()}
                        className="underline"
                      >
                        Zurücksetzen
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-center mt-[2rem]">
                    Du hast noch keine Vokabeln gespeichert. Füge über das
                    Formular oben neue Wörter hinzu oder importiere den
                    Grundwortschatz der App.
                  </p>
                  <ImportButton
                    setCustomWords={setCustomWords}
                    setFilteredWords={setFilteredWords}
                  />
                </>
              )}
            </>
          )}
        </>
      ) : null}
    </main>
  );
}
