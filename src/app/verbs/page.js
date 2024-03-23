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

export default function MyVerbs() {
  const [customVerbs, setCustomVerbs] = useState();
  const [filteredVerbs, setFilteredVerbs] = useState([]);
  const [filterDialogue, setFilterDialogue] = useState(false);
  const [sortingDialogue, setSortingDialogue] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const { data: session, status } = useSession();

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

  const resetFilters = async () => {
    setFilteredVerbs(customVerbs);
    setFilterDialogue(false);
  };

  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : customVerbs ? (
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
                Meine Verben ({customVerbs.length})
              </h1>
              <AddButton toggleAddModal={toggleAddModal} />{" "}
              {customVerbs.length > 0 ? (
                <>
                  <SearchBar
                    customVerbs={customVerbs}
                    setFilteredVerbs={setFilteredVerbs}
                    placeholder="Verben suchen"
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
                    Du hast noch keine Verben gespeichert. Füge über das
                    Formular oben neue Verben hinzu oder importiere den
                    Grundwortschatz der App.
                  </p>
                  <ImportButton
                    setCustomVerbs={setCustomVerbs}
                    setFilteredVerbs={setFilteredVerbs}
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
