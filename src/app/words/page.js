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
import DefaultError from "../components/DefaultError";
import DefaultButton from "../components/DefaultButton";

export default function Words() {
  const [customWords, setCustomWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [filterDialogue, setFilterDialogue] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortingDialogue, setSortingDialogue] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    // loads all words that are saved in the user account
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        setError("");
        setLoading(true);
        try {
          const response = await fetch(`/api/users/${userId}/words`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const { customWords } = await response.json();
          if (customWords) {
            setCustomWords(customWords);
            setFilteredWords(customWords);
          } else {
            setError("Error retrieving words");
          }
        } catch (error) {
          setError("Error retrieving words");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

  const resetFilters = () => {
    setFilteredWords(customWords);
    setFilterDialogue(false);
    setSelectedLevel("all");
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : (
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
                Meine Vokabeln {customWords && `(${customWords.length})`}
              </h1>
              {error && <DefaultError errorMessage={error} />}
              <AddButton toggleAddModal={toggleAddModal} />
              {customWords && customWords.length > 0 ? (
                <>
                  <SearchBar
                    customWords={customWords}
                    setFilteredWords={setFilteredWords}
                    placeholder="Search"
                    setSortingDialogue={setSortingDialogue}
                    setFilterDialogue={setFilterDialogue}
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
                          englishWord={word.englishWord}
                          italianWord={word.italianWord}
                          setFilteredWords={setFilteredWords}
                          setCustomWords={setCustomWords}
                          setError={setError}
                        />
                      ))}
                      {filteredWords.length !== customWords.length ? (
                        <DefaultButton
                          buttonFunction={resetFilters}
                          buttonType="button"
                          buttonText="Reset"
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-center mt-[2rem]">Keine Treffer</p>
                      <DefaultButton
                        buttonFunction={resetFilters}
                        buttonType="button"
                        buttonText="Reset"
                      />
                    </>
                  )}
                </>
              ) : loading ? (
                <LoadingAnimation small />
              ) : (
                <>
                  <p className="text-center mt-[2rem]">
                    You have not saved any words yet. You can import the default
                    vocabulary or add your own words with the form above.
                  </p>
                  <ImportButton
                    setCustomWords={setCustomWords}
                    setFilteredWords={setFilteredWords}
                    setError={setError}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
