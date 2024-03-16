import DefaultCheckbox from "../components/DefaultCheckbox";

export default function FilterOptions({
  favorite,
  handleChange,
  resetFilters,
}) {
  return (
    <form className="w-full mt-4 border-2 border-mint rounded-lg p-2">
      <DefaultCheckbox
        checkboxId="favorites"
        checkboxName="favorites"
        checkboxValue="favorites"
        checkboxLabel="nur Favoriten"
        onChange={handleChange}
        checked={favorite}
      />
      <button onClick={resetFilters} className="mt-4 mx-2 py-1 underline">
        Zurücksetzen
      </button>
    </form>
  );
}
