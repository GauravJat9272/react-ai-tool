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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-100 dark:bg-zinc-900 transition-colors duration-500">
      
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-20 top-0 left-0 h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 p-5 transform transition-transform duration-300 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-1/4 w-3/4 flex flex-col`}
      >
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-6 px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200 font-medium"
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        {/* Recent Search List */}
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
      </div>

      {/* Sidebar toggle for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-30 p-3 rounded-full bg-white dark:bg-zinc-700 shadow text-gray-900 dark:text-white hover:scale-110 transition-transform duration-200"
      >
        ☰
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full md:ml-1/4 p-6">
        
        {/* Header */}
        <h1 className="text-3xl sm:text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
          Hello User, Ask Me Anything
        </h1>

        {/* Chat Messages */}
        <div
          ref={scrollToAns}
          className=" text-white flex-1 overflow-y-auto mb-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 shadow-inner space-y-4"
        >
          {result.map((item, index) => (
            <QuestionAnswer key={index} item={item} index={index} />
          ))}

          {/* Loader Centered */}
          {loader && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/10 z-10 rounded-xl">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 dark:border-gray-600 border-t-purple-600 h-12 w-12"></div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-gray-300 dark:border-zinc-700 p-3 gap-3 shadow-md">
          <input
            type="text"
            value={question}
            onKeyDown={isEnter}
            onChange={(e) => setQuestions(e.target.value)}
            className="flex-1 bg-transparent p-3 outline-none text-gray-900 dark:text-white rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 w-full sm:w-auto"
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-200 w-full sm:w-auto"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
