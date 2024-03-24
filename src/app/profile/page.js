"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloseLink from "../components/CloseLink";
import DefaultError from "../components/DefaultError";
import ImportButton from "../components/ImportButton";
import DefaultButton from "../components/DefaultButton";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Profile() {
  const { data: session, status } = useSession();
  const [registrationDate, setRegistrationDate] = useState("");
  const [customWords, setCustomWords] = useState([]);
  const [wordsLevels, setWordsLevels] = useState([0, 0, 0, 0, 0]);
  const [favorites, setFavorites] = useState([]);
  const [customVerbs, setCustomVerbs] = useState([]);
  const [verbFavorites, setVerbFavorites] = useState([]);
  const [wordsImported, setWordsImported] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session.user.id;
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const {
            registrationDate,
            customWords,
            wordsLevel1,
            wordsLevel2,
            wordsLevel3,
            wordsLevel4,
            wordsLevel5,
            favorites,
            customVerbs,
            verbFavorites,
            wordsImported,
          } = await response.json();
          if (
            registrationDate !== undefined &&
            customWords !== undefined &&
            wordsLevel1 !== undefined &&
            wordsLevel2 !== undefined &&
            wordsLevel3 !== undefined &&
            wordsLevel4 !== undefined &&
            wordsLevel5 !== undefined &&
            favorites !== undefined &&
            customVerbs !== undefined &&
            verbFavorites !== undefined &&
            wordsImported !== undefined
          ) {
            formatRegistrationDate(registrationDate);
            setCustomWords(customWords);
            setWordsLevels([
              wordsLevel1,
              wordsLevel2,
              wordsLevel3,
              wordsLevel4,
              wordsLevel5,
            ]);
            setFavorites(favorites);
            setCustomVerbs(customVerbs);
            setVerbFavorites(verbFavorites);
            setWordsImported(wordsImported);
            setError("");
          } else {
            setError("Error retrieving user data2");
          }
        } catch (error) {
          setError("Error retrieving user data");
        }
      }
    };
    fetchData();
  }, [session]);

  const formatRegistrationDate = (registrationDate) => {
    const formattedYear = registrationDate.slice(0, 4);
    const formattedMonth = registrationDate.slice(5, 7);
    const formattedDay = registrationDate.slice(8, 10);
    setRegistrationDate(`${formattedDay}.${formattedMonth}.${formattedYear}`);
  };

  const signOutUser = () => {
    signOut();
    if (session) {
      router.push("/");
    }
  };

  return (
    <main>
      {status === "loading" ? (
        <LoadingAnimation />
      ) : error ? (
        <>{error && <DefaultError errorMessage={error} />}</>
      ) : (
        <>
          {session && registrationDate !== undefined ? (
            <>
              <CloseLink href="/home" />
              <div className="flex w-[80%] mb-4">
                <div className="w-[50%] ">
                  <p className="font-bold text-lg text-mint mb-4">
                    {session.user.name}
                  </p>
                  <p>registriert seit:</p>
                  <p>{registrationDate}</p>
                </div>
                <div className="flex justify-end w-[50%]">
                  <Image
                    src="/profile-pic.jpg"
                    alt="profile-picture"
                    width={100}
                    height={100}
                    className="rounded-[50%]"
                  />
                </div>
              </div>
              <p className="font-bold text-lg text-mint mb-4">Statistik</p>
              <div className="w-[80%]">
                <p className="w-[6rem] bg-mint text-center text-white rounded-t-lg py-1">
                  Wörter
                </p>
                <ul className="w-full bg-superlightblue px-6 grid grid-cols-2 rounded-b-lg rounded-r-lg">
                  <li className="py-1">Gesamt</li>
                  <li className="py-1 justify-self-end font-bold text-mint">
                    {customWords.length}
                  </li>
                  {wordsLevels.map((level, index) => (
                    <Fragment key={index}>
                      <li className="py-1">Level {index + 1}</li>
                      <li className="py-1 justify-self-end font-bold text-mint">
                        {wordsLevels[index]}
                      </li>
                    </Fragment>
                  ))}
                  <li className="py-1">Favoriten</li>
                  <li className="py-1 justify-self-end font-bold text-mint ">
                    {favorites}
                  </li>
                </ul>
              </div>
              <div className="w-[80%]">
                <p className="w-[6rem] bg-mint text-center text-white rounded-t-lg py-1">
                  Verben
                </p>
                <ul className="w-full bg-superlightblue px-6 grid grid-cols-2 rounded-b-lg rounded-r-lg">
                  <li className="py-1">Gesamt</li>
                  <li className="py-1 justify-self-end font-bold text-mint">
                    {customVerbs.length}
                  </li>
                  <li className="py-1">Favoriten</li>
                  <li className="py-1 justify-self-end font-bold text-mint ">
                    {verbFavorites}
                  </li>
                </ul>
              </div>
              <>{error2 && <DefaultError errorMessage={error2} />}</>
              {!wordsImported && customWords.length === 0 ? (
                <>
                  <p className="text-center">
                    Du hast noch keine Vokabeln gespeichert. Möchtest du den
                    Grundwortschatz der App hinzufügen?
                  </p>
                  <ImportButton
                    setError={setError2}
                    setCustomWords={setCustomWords}
                  >
                    Importieren
                  </ImportButton>
                </>
              ) : null}
              <DefaultButton
                buttonFunction={signOutUser}
                buttonType="button"
                buttonText="Abmelden"
              />
            </>
          ) : null}
        </>
      )}
    </main>
  );
}
