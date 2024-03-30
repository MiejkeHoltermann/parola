"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VerbCard from "../components/Verbs/VerbCard";
import SortingOptions from "../components/Verbs/SortingOptions";
import FilterOptions from "../components/Verbs/FilterOptions";
import SearchBar from "../components/Verbs/SearchBar";
import LoadingAnimation from "../components/LoadingAnimation";
import ImportButton from "../components/ImportButton";
import VerbForm from "../components/Verbs/VerbForm";
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
  const [checked, setChecked] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

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
    setChecked(false);
  };

  console.log(checked);

  return (
    <main>
      <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
        {status === "authenticated" ? (
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
                <DefaultButton
                  buttonFunction={toggleAddModal}
                  buttonText="Add verbs"
                />
                {customVerbs && customVerbs.length > 0 ? (
                  <>
                    <SearchBar
                      customVerbs={customVerbs}
                      setFilteredVerbs={setFilteredVerbs}
                      placeholder="Search"
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
                        checked={checked}
                        setChecked={setChecked}
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
                      You have not saved any verbs yet. You can import the
                      default vocabulary or add your own verbs with the form
                      above.
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
        ) : (
          <LoadingAnimation />
        )}
      </div>
    </main>
  );
}
