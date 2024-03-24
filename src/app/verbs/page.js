"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VerbCard from "../components/Verbs/VerbCard";
import SortingOptions from "../components/Verbs/SortingOptions";
import FilterOptions from "../components/Verbs/FilterOptions";
import SearchBar from "../components/Verbs/SearchBar";
import LoadingAnimation from "../components/LoadingAnimation";
import ImportButton from "../components/ImportButton";
import VerbForm from "../components/Verbs/VerbForm";
import AddButton from "../components/Verbs/AddButton";
import CloseLink from "../components/CloseLink";
import DefaultError from "../components/DefaultError";
import DefaultButton from "../components/DefaultButton";

export default function MyVerbs() {
  const [customVerbs, setCustomVerbs] = useState();
  const [filteredVerbs, setFilteredVerbs] = useState([]);
  const [filterDialogue, setFilterDialogue] = useState(false);
  const [sortingDialogue, setSortingDialogue] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    // loads all verbs that are saved in the user account
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        setError("");
        setLoading(true);
        try {
          const response = await fetch(`/api/users/${userId}/verbs`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const { customVerbs } = await response.json();
          if (customVerbs) {
            setCustomVerbs(customVerbs);
            setFilteredVerbs(customVerbs);
          } else {
            setError("Error retrieving verbs");
          }
        } catch (error) {
          setError("Error retrieving verbs");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

  const resetFilters = async () => {
    setFilteredVerbs(customVerbs);
    setFilterDialogue(false);
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : (
        <>
          {addModal ? (
            <VerbForm
              toggleAddModal={toggleAddModal}
              setCustomVerbs={setCustomVerbs}
              setFilteredVerbs={setFilteredVerbs}
            />
          ) : (
            <>
              <CloseLink href="/home" />
              <h1 className="text-xl font-bold">
                Meine Verben {customVerbs && `(${customVerbs.length})`}
              </h1>
              {error && <DefaultError errorMessage={error} />}
              <AddButton toggleAddModal={toggleAddModal} />
              {customVerbs && customVerbs.length > 0 ? (
                <>
                  <SearchBar
                    customVerbs={customVerbs}
                    setFilteredVerbs={setFilteredVerbs}
                    placeholder="Verben suchen"
                    setSortingDialogue={setSortingDialogue}
                    setFilterDialogue={setFilterDialogue}
                  />
                  <div className="relative w-[90%]">
                    <FilterOptions
                      customVerbs={customVerbs}
                      setFilteredVerbs={setFilteredVerbs}
                      filterDialogue={filterDialogue}
                      setFilterDialogue={setFilterDialogue}
                      setSortingDialogue={setSortingDialogue}
                      resetFilters={resetFilters}
                    />
                    <SortingOptions
                      customVerbs={customVerbs}
                      filteredVerbs={filteredVerbs}
                      setFilteredVerbs={setFilteredVerbs}
                      sortingDialogue={sortingDialogue}
                      setSortingDialogue={setSortingDialogue}
                      setFilterDialogue={setFilterDialogue}
                    />
                  </div>
                  {filteredVerbs.length > 0 ? (
                    <>
                      {filteredVerbs.map((verb) => (
                        <VerbCard
                          key={verb._id}
                          verb={verb}
                          setFilteredVerbs={setFilteredVerbs}
                          setCustomVerbs={setCustomVerbs}
                          setError={setError}
                        />
                      ))}
                      {filteredVerbs.length !== customVerbs.length ? (
                        <DefaultButton
                          buttonFunction={resetFilters}
                          buttonType="button"
                          buttonText="Zurücksetzen"
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-center mt-[2rem]">Keine Treffer</p>
                      <DefaultButton
                        buttonFunction={resetFilters}
                        buttonType="button"
                        buttonText="Zurücksetzen"
                      />
                    </>
                  )}
                </>
              ) : loading ? (
                <LoadingAnimation small />
              ) : (
                <>
                  <p className="text-center mt-[2rem]">
                    Du hast noch keine Verben gespeichert. Füge über das
                    Formular oben neue Verben hinzu oder importiere den
                    Grundwortschatz der App.
                  </p>
                  <ImportButton
                    setCustomVerbs={setCustomVerbs}
                    setFilteredVerbs={setFilteredVerbs}
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
