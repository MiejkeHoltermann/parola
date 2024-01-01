import Checkbox from "../components/Checkbox";

export default function FilterOptions({
  favorite,
  handleChange,
  resetFilters,
}) {
  return (
    <form className="w-full mt-4 border-2 border-mint rounded-lg p-2">
      <Checkbox
        checkboxId="favorites"
        checkboxName="favorites"
        checkboxValue="favorites"
        checkboxLabel="nur Favoriten"
        onChange={handleChange}
        favorite={favorite}
      />
      <button onClick={resetFilters} className="mt-4 mx-2 py-1 underline">
        Zurücksetzen
      </button>
    </form>
  );
}
