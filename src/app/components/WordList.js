import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default async function WordList() {
  const { data } = useSWR("/api/words", fetcher);
  return (
    <>
      {data.map((word) => (
        <div key={word._id}>
          <h2>{word.germanWord}</h2>
          <h2>{word.italianWord}</h2>
        </div>
      ))}
      ;
    </>
  );
}
