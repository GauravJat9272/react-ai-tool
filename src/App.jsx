import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";

import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestions] = useState("");
  const [result, SetResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dark/Light mode toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    if (question) {
      const history = [question, ...(JSON.parse(localStorage.getItem("history")) || [])];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    const payloadData = question || selectedHistory;
    const payload = { contents: [{ parts: [{ text: payloadData }] }] };

    setLoader(true);

    setTimeout(async () => {
      let response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      response = await response.json();

      let dataString = response.candidates[0].content.parts[0].text;
      dataString = dataString.split("*").map((item) => item.trim());

      SetResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: dataString },
      ]);
      setQuestions("");
      setLoader(false);
    }, 200);
  };

  const isEnter = (e) => e.key === "Enter" && askQuestion();

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  useEffect(() => {
    if (scrollToAns.current) {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-20 top-0 left-0 h-full bg-red-100 dark:bg-zinc-800 border-r border-red-100 dark:border-zinc-700 p-4 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-1/4 w-3/4 flex flex-col`}
      >
        {/* Dark/Light Mode Toggle on top */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-3 px-3 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 text-black dark:text-white w-full"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Recent Search List */}
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
      </div>

      {/* Sidebar toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
      >
        ☰
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full md:ml-1/4 p-4 md:p-6 relative">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 text-center">
          Hello User, Ask me Anything
        </h1>

        {/* Chat Messages */}
        <div ref={scrollToAns} className="flex-1 overflow-y-auto mb-4 relative">
          <ul className="space-y-3 dark:text-zinc-300 text-zinc-800">
            {result.map((item, index) => (
              <QuestionAnswer key={index} item={item} index={index} />
            ))}
          </ul>

          {/* Loader Centered */}
          {loader && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/20 z-10">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5C100 78.2 77.6 100.6 50 100.6C22.4 100.6 0 78.2 0 50.5C0 22.8 22.4 0.4 50 0.4C77.6 0.4 100 22.8 100 50.5Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9 39.1C96.4 38.4 97.6 35.6 96.5 33.2C95.4 30.8 92.6 29.6 90.1 30.3C86.3 31.3 82.5 32 78.7 32.6C74.9 33.2 71.1 33.7 67.3 34.2C63.5 34.7 59.7 35 55.9 35.3C52.1 35.6 48.3 35.8 44.5 36C40.7 36.2 36.9 36.3 33.1 36.5C29.3 36.7 25.5 36.8 21.7 36.9C17.9 37 14.1 37 10.3 37C6.5 37 2.7 37 0 37"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl mx-auto bg-red-100 dark:bg-zinc-800 rounded-3xl border border-zinc-400 dark:border-zinc-700 p-2 gap-2">
          <input
            type="text"
            value={question}
            onKeyDown={isEnter}
            onChange={(e) => setQuestions(e.target.value)}
            className="flex-1 bg-transparent p-2 outline-none text-zinc-800 dark:text-white rounded-lg w-full sm:w-auto"
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium hover:opacity-90 transition w-full sm:w-auto"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
