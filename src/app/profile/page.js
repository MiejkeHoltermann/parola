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

  if (status === "unauthenticated") {
    router.push("/");
  }

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
            setError("Error retrieving user data");
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

  return (
    <main>
      <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
        {status === "loading" ? (
          <LoadingAnimation />
        ) : error ? (
          <>{error && <DefaultError errorMessage={error} />}</>
        ) : (
          <>
            {session && registrationDate !== undefined ? (
              <>
                <CloseLink href="/home" />
                <div className="flex justify-between w-[80%] mb-[1rem]">
                  <div className="w-[50%] ">
                    <p className="font-bold text-lg text-mint mb-[1rem]">
                      {session.user.name}
                    </p>
                    <p>registered since:</p>
                    <p>{registrationDate}</p>
                  </div>
                  <div className="w-[36%]">
                    <Image
                      src="/profile-pic.jpg"
                      alt="profile-picture"
                      width={200}
                      height={200}
                      className="rounded-[50%]"
                    />
                  </div>
                </div>
                <p className="font-bold text-lg text-mint mt-[2rem]">
                  Statistics
                </p>
                <div className="w-[80%]">
                  <p className="w-[6rem] bg-mint text-center text-white rounded-t-lg py-[0.2rem]">
                    Words
                  </p>
                  <ul className="w-full bg-superlightblue px-[1.4rem] py-[0.8rem] grid grid-cols-2 rounded-b-lg rounded-r-lg">
                    <li className="py-[0.2rem]">All</li>
                    <li className="py-[0.2rem] justify-self-end font-bold text-mint">
                      {customWords.length}
                    </li>
                    {wordsLevels.map((level, index) => (
                      <Fragment key={index}>
                        <li className="py-[0.2rem]">Level {index + 1}</li>
                        <li className="py-[0.2rem] justify-self-end font-bold text-mint">
                          {wordsLevels[index]}
                        </li>
                      </Fragment>
                    ))}
                    <li className="py-[0.2rem]">Favorites</li>
                    <li className="py-[0.2rem] justify-self-end font-bold text-mint ">
                      {favorites}
                    </li>
                  </ul>
                </div>
                <div className="w-[80%]">
                  <p className="w-[6rem] bg-mint text-center text-white rounded-t-lg py-[0.2rem]">
                    Verbs
                  </p>
                  <ul className="w-full bg-superlightblue px-[1.4rem] py-[0.8rem] grid grid-cols-2 rounded-b-lg rounded-r-lg">
                    <li className="py-[0.2rem]">All</li>
                    <li className="py-[0.2rem] justify-self-end font-bold text-mint">
                      {customVerbs.length}
                    </li>
                    <li className="py-[0.2rem]">Favorites</li>
                    <li className="py-[0.2rem] justify-self-end font-bold text-mint">
                      {verbFavorites}
                    </li>
                  </ul>
                </div>
                <>{error2 && <DefaultError errorMessage={error2} />}</>
                {!wordsImported && customWords.length === 0 ? (
                  <>
                    <p className="text-center">
                      You have not saved any words yet. Do you want to import
                      the default vocabulary?
                    </p>
                    <ImportButton
                      setError={setError2}
                      setCustomWords={setCustomWords}
                    >
                      Import
                    </ImportButton>
                  </>
                ) : null}
                <DefaultButton
                  buttonFunction={() => signOut()}
                  buttonType="button"
                  buttonText="Sign out"
                />
              </>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
