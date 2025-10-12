import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Home,
  Mic,
  Search,
  SendHorizonal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Game constants
const GAME_DURATION_MS = 10000; // 10s
const DOT_SIZE = 36; // px

const NotFound = () => {
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(GAME_DURATION_MS / 1000));
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(() =>
    parseInt(localStorage.getItem("highestScore") || "0", 10)
  );
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 }); // percent
  const [gameMessage, setGameMessage] = useState("");
  const arenaRef = useRef(null);
  const timerRef = useRef(null);
  const dotRef = useRef(null);
  const scoreRef = useRef(0);
  const { searchQuery, setSearchQuery } = useContext(AppContext);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let isMounted = true; // Prevent state updates after unmount
    if (timerRef.current) window.clearInterval(timerRef.current); // Clear any existing interval
    const start = Date.now();
    const end = start + 10000;
    console.log(score);

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      console.log(start, end, now, score, highestScore);
      const remaining = Math.max(0, Math.ceil((end - now) / 1000));
      if (isMounted) setTimeLeft(remaining);
      if (now > end) {
        endGame();
      }
    }, 500);

    return () => {
      isMounted = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing]);

  const randomizeDot = () => {
    const area = arenaRef.current;
    if (!area) return;
    const marginPercent = 6;
    const x = Math.random() * (100 - marginPercent * 2) + marginPercent;
    const y = Math.random() * (100 - marginPercent * 2) + marginPercent;
    setDotPos({ x, y });
  };

  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(Math.ceil(GAME_DURATION_MS / 1000));
    setGameMessage("");
    setPlaying(true);
    setTimeout(() => randomizeDot(), 50);
  };

  const endGame = () => {
    setPlaying(false);
    setTimeLeft(Math.ceil(GAME_DURATION_MS / 1000));
    // Use scoreRef.current to get the most up-to-date score
    const finalScore = scoreRef.current;
    setGameMessage(`Finished — your score: ${finalScore}`);

    if (finalScore > highestScore) {
      setHighestScore(finalScore);
      localStorage.setItem("highestScore", finalScore.toString());
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const handleDotClick = (e) => {
    e.stopPropagation();
    if (!playing) return;
    setScore((s) => {
      const newScore = s + 1;
      console.log("Score incremented to", newScore);
      return newScore;
    });
    setGameMessage("Nice!");
    setTimeout(() => setGameMessage(""), 400);
    randomizeDot();
  };

  const handleArenaClick = () => {
    if (!playing) return;
    setGameMessage("Miss!");
    setTimeout(() => setGameMessage(""), 300);
  };

  const getButtonText = () => {
    if (playing) return "End Game";
    if (!playing && score > 0) return "Play Again";
    return "Play Now";
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-2 sm:p-4">
      <main
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200"
        role="main"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] bg-gradient-to-b from-white to-gray-50">
          {/* Left */}
          <section className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col items-center justify-start">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
                <AlertTriangle
                  className="text-primary animate-pulse sm:size-12 "
                  size={36}
                  aria-hidden
                />
                404
              </div>
              <h1
                id="notfound-title"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary"
              >
                Page Not Found
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 text-center max-w-xs max-sm:hidden sm:max-w-md">
                Oops, that page is missing! Try searching or play a quick game
                to catch the dot.
              </p>
            </div>
            <div className="border relative flex bg-purple-100 border-purple-100 rounded-full px-[0.1rem] py-[0.05rem] shadow-sm w-full sm:w-3/4 mx-auto">
              <input
                type="text"
                placeholder="Search for something..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 pr-14 bg-gray-50 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                aria-label="Search input"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-purple-50 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                title={searchQuery ? "Send" : "Voice search"}
                aria-label="search"
              >
                {searchQuery ? <SendHorizonal size={20} /> : <Mic size={20} />}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center sm:justify-start">
              <Link to="/">
                <button className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-primary text-white text-sm sm:text-base font-semibold hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all cursor-pointer">
                  <Home size={16} />
                  Back to Home
                </button>
              </Link>
              <button
                onClick={() => (playing ? endGame() : startGame())}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all cursor-pointer ${
                  playing
                    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "bg-purple-50 border-transparent text-primary-dull hover:bg-purple-100"
                }`}
              >
                {getButtonText()}
              </button>
              <div className="xs:ml-auto text-center">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Time
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {timeLeft}s
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-700 text-center sm:text-left">
              <strong>Score:</strong>{" "}
              <span className="font-semibold text-purple-600">{score}</span>
              {highestScore > 0 && (
                <span className="ml-2">
                  {" | "}
                  <strong>Highest:</strong>{" "}
                  <span className="font-semibold text-purple-600">
                    {highestScore}
                  </span>
                </span>
              )}
              <div className="block mt-2 h-4 text-xs sm:text-sm text-gray-500 font-medium animate-pulse">
                {gameMessage}
              </div>
            </div>
          </section>
          {/* Right — game arena */}
          <aside className="p-4 sm:p-6">
            <div
              ref={arenaRef}
              role="application"
              aria-label="Catch the dot game area"
              tabIndex={0}
              onClick={handleArenaClick}
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] max-h-[400px] rounded-xl border border-gray-100 bg-white shadow-md flex items-center justify-center overflow-hidden"
            >
              {!playing && (
                <div className="absolute inset-0 pb-14 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6 text-center z-10">
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    Click{" "}
                    <span className="font-bold text-primary">
                      Play {score ? "Again" : "Now"}{" "}
                    </span>{" "}
                    to start
                  </p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Dot */}
                <button
                  ref={dotRef}
                  type="button"
                  onClick={handleDotClick}
                  aria-label="Target dot"
                  disabled={!playing}
                  style={{
                    left: `${dotPos.x}%`,
                    top: `${dotPos.y}%`,
                    width: `${DOT_SIZE}px`,
                    height: `${DOT_SIZE}px`,
                    marginLeft: `-${DOT_SIZE / 2}px`,
                    marginTop: `-${DOT_SIZE / 2}px`,
                  }}
                  className={`absolute rounded-full flex items-center justify-center transform focus:outline-none focus:ring-2 focus:ring-purple-400 transition-transform ${
                    playing ? "cursor-pointer" : "pointer-events-none"
                  }`}
                >
                  <span className="block w-full h-full rounded-full bg-purple-500 shadow-lg scale-110" />
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold text-gray-700 shadow">
                {playing ? "Go!" : "Ready"}
              </div>
            </div>
          </aside>
        </div>
        <div className="w-full py-3 sm:py-4 flex items-center justify-center text-xs sm:text-sm text-gray-500 font-medium">
          Tip: Click to catch the dot — be quick!
        </div>
      </main>
    </div>
  );
};

export default NotFound;
