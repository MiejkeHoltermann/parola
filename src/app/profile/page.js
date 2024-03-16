"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";

export default function Profile() {
  const { data: session, status } = useSession();
  const [registrationDate, setRegistrationDate] = useState("");
  const [customWords, setCustomWords] = useState([]);
  const [wordsLevels, setWordsLevels] = useState([0, 0, 0, 0, 0]);
  const [favorites, setFavorites] = useState([]);
  const [customVerbs, setCustomVerbs] = useState([]);
  const [verbFavorites, setVerbFavorites] = useState([]);
  const [wordsImported, setWordsImported] = useState(false);

  const router = useRouter();

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
        } catch (error) {
          console.error("Error fetching data.", error);
        }
      }
    };
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session]);

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
        if (response.ok) {
          console.log("Successfully imported default words.");
        }
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
        <>
          {session && registrationDate && customWords ? (
            <>
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
              {!wordsImported ? (
                <>
                  <p className="text-center">
                    Möchtest du den umfangreichen Grundwortschatz der App
                    hinzufügen?
                  </p>
                  <button
                    onClick={importWords}
                    className=" bg-darkmint flex justify-center gap-2 text-white w-40 font-bold rounded-xl cursor-pointer px-6 py-2"
                  >
                    Importieren
                  </button>
                </>
              ) : null}
              <button
                onClick={signOutUser}
                className="my-[1rem] bg-darkmint flex justify-center gap-2 text-white w-40 font-bold rounded-xl cursor-pointer px-6 py-2"
              >
                Abmelden
              </button>
            </>
          ) : null}
        </>
      )}
    </main>
  );
}
