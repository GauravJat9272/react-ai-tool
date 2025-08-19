function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  return (
    <div className="flex flex-col h-full bg-red-100 dark:bg-zinc-800">
      {/* Header */}
      <div className="flex justify-center items-center gap-2 p-3 border-b border-red-100 dark:border-zinc-700 sticky top-0 bg-red-100 dark:bg-zinc-800 z-10">
        <span className="text-xl dark:text-white text-zinc-800">Recent Search</span>
        <button onClick={clearHistory} className="cursor-pointer text-zinc-800 dark:text-white">
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
      <ul className="flex-1 overflow-y-auto px-3 py-2 space-y-1 dark:text-zinc-400 text-zinc-700">
        {recentHistory.map((item, index) => (
          <li
            key={index}
            onClick={() => setSelectedHistory(item)}
            className="truncate cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-800 px-2 py-1 rounded"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSearch;
