import React, { useState, useEffect } from "react";
import words from "../words.js";

function shuffleWord(word) {
  let arr = word.split("");
  let shuffled;
  do {
    shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.join("") === word && word.length > 1);
  return shuffled.join("");
}

export default function App() {
  const [wordLength, setWordLength] = useState(5);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [otherValid, setOtherValid] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([5, 6]);
  const timerOptions = [5, 10, 15, 30];
  const [timerSetting, setTimerSetting] = useState(10);
  const [timer, setTimer] = useState(timerSetting);
  const [pauseActive, setPauseActive] = useState(false);
  const timerRef = React.useRef();
  const inputRef = React.useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    nextWord();
    // eslint-disable-next-line
  }, [selectedLengths]);

  useEffect(() => {
    setTimer(timerSetting);
  }, [timerSetting, currentWord]);

  useEffect(() => {
    if (!showAnswer) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setShowAnswer(true);
            // Only add to history if not already added for this word
            setHistory(prev => {
              if (prev.length > 0 && prev[prev.length - 1].word === currentWord) {
                return prev;
              }
              return [
                ...prev,
                {
                  word: currentWord,
                  guess: guess,
                  correct: false
                }
              ];
            });
            nextWord(3000);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [currentWord, showAnswer, timerSetting]);

  function getRandomWord() {
    // Filter words by selected lengths, fallback to all words if none found
    const filtered = words.filter((w) => selectedLengths.includes(w.length));
    const pool = filtered.length > 0 ? filtered : words;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function shuffleWord(word) {
    let arr = word.split("");
    let shuffled;
    do {
      shuffled = arr.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.join("") === word && word.length > 1);
    return shuffled.join("");
  }

  function nextWord(delay = 0) {
    setPauseActive(false);
    setTimeout(() => {
      const word = getRandomWord();
      setCurrentWord(word);
      setScrambled(shuffleWord(word));
      setGuess("");
      setResult("");
      setShowAnswer(false);
      setPauseActive(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, delay);
    const anagrams = words.filter(
      (word) =>
        word.length === currentWord.length &&
        isAnagram(word.toLowerCase(), currentWord.toLowerCase()) &&
        word !== guess
    );
    setOtherValid(anagrams);
  }

  function isAnagram(a, b) {
    return (
      a.length === b.length &&
      a.split("").sort().join("") === b.split("").sort().join("")
    );
  }

  function handleGuess(e) {
    e.preventDefault();
    if (pauseActive) return;
    if (result === "Invalid guess") setResult("");
    const userGuess = guess.trim().toLowerCase();
    // Check if guess contains all the same letters as the word
    const isSameLetters =
      userGuess.length === currentWord.length &&
      userGuess.split("").sort().join("") === currentWord.toLowerCase().split("").sort().join("");
    if (!isSameLetters) {
      setResult("Invalid guess");
      setGuess("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    const valid =
      isAnagram(userGuess.toUpperCase(), currentWord.toUpperCase()) &&
      words.includes(userGuess.toUpperCase());
    setGuess(""); // Clear input after guess
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setShowAnswer(true);
    setPauseActive(true);
    setResult(valid ? "Correct!" : "Wrong answer.");
    setHistory(prev => [
      ...prev,
      {
        word: currentWord,
        guess: userGuess,
        correct: valid
      }
    ]);
    nextWord(2000);
  }
  // Get available word lengths for dropdown
  const uniqueLengths = [5, 6, 7, 8];
  useEffect(() => {
    if (timer === 0 && result === "Invalid guess") {
      setResult("");
    }
  }, [timer]);
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* <h1>Anagram Game</h1> */}
      <div style={{ marginBottom: 16, textAlign: "left" }}>
        <span>Word lengths:</span>
        {uniqueLengths.map((len) => (
          <label key={len} style={{ marginLeft: 12, fontSize: "1rem" }}>
            <input
              type="checkbox"
              checked={selectedLengths.includes(len)}
              onChange={() => {
                setSelectedLengths((prev) =>
                  prev.includes(len)
                    ? prev.filter((l) => l !== len)
                    : [...prev, len]
                );
              }}
              style={{ marginRight: 4 }}
            />
            {len}
          </label>
        ))}
        <div style={{ marginTop: 12 }}>
          <label htmlFor="timer-setting">Timer: </label>
          <select
            id="timer-setting"
            value={timerSetting}
            onChange={e => setTimerSetting(Number(e.target.value))}
            style={{ fontSize: "1rem", padding: "0.3rem", marginLeft: 8 }}
          >
            {timerOptions.map(opt => (
              <option key={opt} value={opt}>{opt} seconds</option>
            ))}
          </select>
        </div>
      </div>
      <div
        style={{ fontSize: "2rem", letterSpacing: "0.2em", margin: "1.5rem 0" }}
      >
        {scrambled}
      </div>
      <div style={{ fontSize: "2rem", margin: "1rem 0", color: "#555" }}>
        {timer}
      </div>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          ref={inputRef}
          style={{
            fontSize: "1.2rem",
            padding: "0.5rem",
            width: "70%",
            boxSizing: "border-box",
            height: "2.4rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        <button
          type="submit"
          disabled={(showAnswer && result !== "Invalid guess") || timer === 0}
          style={{
            fontSize: "1.2rem",
            marginLeft: 8,
            padding: "0.5rem",
            height: "2.4rem",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        >
          Guess
        </button>
      </form>
      <button
        type="button"
        style={{ marginTop: 12, fontSize: "1rem", padding: "0.4rem 1rem" }}
        onClick={() => {
          setShowAnswer(true);
          nextWord(3000);
        }}
        disabled={showAnswer}
      >
        Reveal Answer
      </button>
      {showAnswer && (
        <div
          style={{
            marginTop: 12,
            color:
              result === "Correct!"
                ? "green"
                : result === "Wrong answer." || timer === 0
                ? "red"
                : result === "Invalid guess"
                ? "orange"
                : undefined,
            fontWeight: "bold"
          }}
        >
          Answer: {currentWord}
        </div>
      )}
      {result && (
        <div
          style={{
            marginTop: 16,
            fontWeight: "bold",
            color:
              result === "Correct!"
                ? "green"
                : result === "Wrong answer."
                ? "red"
                : result === "Invalid guess"
                ? "orange"
                : undefined
          }}
        >
          {result}
          {result === "Wrong answer." && (
            <div
              style={{
                marginTop: 8,
                fontWeight: "normal",
                fontSize: "1rem",
                color: "red"
              }}
            >
              {/* No valid answers shown for wrong answer */}
            </div>
          )}
          {result === "Invalid guess" && (
            <div
              style={{
                marginTop: 8,
                fontWeight: "normal",
                fontSize: "1rem",
                color: "orange"
              }}
            >
              {/* No valid answers shown for invalid guess */}
            </div>
          )}
        </div>
      )}
      {/* History List - always show */}
      {history.length > 0 && (
        <div style={{ marginTop: 24, textAlign: "left" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>
            Previous Words:
            <span style={{ fontWeight: "normal", fontSize: "0.95rem", marginLeft: 8 }}>
              {history.filter(h => h.correct).length}/{history.length} correct
            </span>
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[...history].reverse().map((item, idx) => (
              <li key={idx} style={{
                marginBottom: 4,
                color: item.correct ? "green" : "red",
                fontWeight: item.correct ? "bold" : "normal"
              }}>
                {item.word} &rarr; {item.guess || <em>No guess</em>} {item.correct ? "✓" : "✗"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
