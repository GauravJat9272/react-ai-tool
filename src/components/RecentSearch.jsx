function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  return (
    <div className="flex flex-col h-full bg-red-50 dark:bg-zinc-900 shadow-inner rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-red-200 dark:border-zinc-700 sticky top-0 bg-red-100 dark:bg-zinc-800 z-10 shadow-sm">
        <span className="text-lg font-semibold dark:text-white text-zinc-800">
          Recent Searches
        </span>
        <button
          onClick={clearHistory}
          className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-zinc-700 transition-colors duration-200"
          title="Clear History"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </div>

      {/* Scrollable History */}
      <ul className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {recentHistory.length === 0 ? (
          <li className="text-center text-sm italic dark:text-zinc-500 text-zinc-600">
            No recent searches
          </li>
        ) : (
          recentHistory.map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedHistory(item)}
              className="truncate cursor-pointer px-3 py-2 rounded-lg bg-red-50 dark:bg-zinc-800 hover:bg-red-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 shadow-sm"
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RecentSearch;
