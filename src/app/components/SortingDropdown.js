export default function SortingDropdown({ sortWords, levels }) {
  return (
    <div className="absolute top-10 right-0 z-10 border-2 border-mint bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700">
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        <button
          onClick={() => sortWords("alphabet", "asc")}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Alphabet A - Z
        </button>
        <button
          onClick={() => sortWords("alphabet", "desc")}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Alphabet Z - A
        </button>
        {levels ? (
          <>
            <button
              onClick={() => sortWords("level", "asc")}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Level 1 - 5
            </button>
            <button
              onClick={() => sortWords("level", "desc")}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Level 5 - 1
            </button>
          </>
        ) : null}
      </ul>
    </div>
  );
}
