import { useState } from "react";
import { getRandomWord } from "./utils";
import logo from "/logo.png";
import "./App.css";

function App() {
  // State for the current secret word
  const [currWord, setCurrentWord] = useState(getRandomWord());

  // State to store all guessed letters
  const [guessedLetters, setGuessedLetters] = useState([]);

  // State to store the current guess (single letter)
  const [currentGuess, setCurrentGuess] = useState("");

  // State to track the number of incorrect guesses
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

  // State to track whether the game is over
  const [gameOver, setGameOver] = useState(false);

  // State to track whether the user has won
  const [hasWon, setHasWon] = useState(false);

  // State to track the number of rounds played and wins
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [wins, setWins] = useState(0);

  // State to track input errors (e.g., invalid guess)
  const [inputError, setInputError] = useState("");

  // Maximum number of allowed incorrect guesses
  const maxIncorrectGuesses = 10;

  // Function to generate the word display with guessed letters revealed
  const generateWordDisplay = () => {
    const wordDisplay = [];
    for (let letter of currWord) {
      if (guessedLetters.includes(letter)) {
        wordDisplay.push(letter); // Show the letter if it's been guessed
      } else {
        wordDisplay.push("_"); // Show an underscore if the letter hasn't been guessed
      }
    }
    return wordDisplay.join(" "); // Add spaces between letters for better readability
  };

  // Function to handle form submission
  const handleGuessSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validate the input
    if (currentGuess.length !== 1 || !/[a-zA-Z]/.test(currentGuess)) {
      setInputError("Please enter a valid single letter.");
      return;
    }

    if (guessedLetters.includes(currentGuess)) {
      setInputError("You've already guessed this letter.");
      return;
    }

    // Clear any previous error messages
    setInputError("");

    // Add the guessed letter to the list
    setGuessedLetters([...guessedLetters, currentGuess]);

    // Check if the guessed letter is incorrect
    if (!currWord.includes(currentGuess)) {
      setIncorrectGuesses(incorrectGuesses + 1); // Increment incorrect guesses
    }

    // Clear the input field
    setCurrentGuess("");
  };

  // Function to check if the user has won
  const checkWin = () => {
    return currWord.split("").every((letter) => guessedLetters.includes(letter));
  };

  // Function to reset the game
  const resetGame = () => {
    setCurrentWord(getRandomWord()); // Get a new random word
    setGuessedLetters([]); // Reset guessed letters
    setIncorrectGuesses(0); // Reset incorrect guesses
    setGameOver(false); // Reset game over state
    setHasWon(false); // Reset win state
  };

  // Function to start a new round
  const startNewRound = () => {
    setRoundsPlayed(roundsPlayed + 1); // Increment rounds played
    if (hasWon) {
      setWins(wins + 1); // Increment wins if the user won the previous round
    }
    resetGame(); // Reset the game for the new round
  };

  // Check for win/lose conditions after each guess
  if (!gameOver) {
    if (checkWin()) {
      setGameOver(true);
      setHasWon(true);
    } else if (incorrectGuesses >= maxIncorrectGuesses) {
      setGameOver(true);
      setHasWon(false);
    }
  }

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <div className="card">
        <h1>Guess The Word 🚀</h1>

        {/* Score Display Section */}
        <h3>Score</h3>
        <div className="score-display">
          Wins: {wins} / Rounds Played: {roundsPlayed}
        </div>

        {/* Word Display Section */}
        <h3>Word Display</h3>
        <div className="word-display">{generateWordDisplay()}</div>

        {/* Guessed Letters Section */}
        <h3>Guessed Letters</h3>
        <div className="guessed-letters">
          {guessedLetters.length > 0 ? guessedLetters.join(", ") : "-"}
        </div>

        {/* Guesses Remaining Section */}
        <h3>Guesses Remaining</h3>
        <div className="guesses-remaining">
          {maxIncorrectGuesses - incorrectGuesses}
        </div>

        {/* Visual Indicator (Rocket Image) */}
        <div className="rocket-container">
          <img
            src={`/rocket-${incorrectGuesses}.png`} // Images named rocket-0.png, rocket-1.png, etc.
            alt="Rocket"
            className="rocket-image"
          />
        </div>

        {/* Input Form Section */}
        {!gameOver && (
          <>
            <h3>Input</h3>
            <form onSubmit={handleGuessSubmit} className="guess-form">
              <input
                type="text"
                maxLength={1} // Limit input to one letter
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                className="guess-input"
                placeholder="Enter a letter"
              />
              <button type="submit" className="guess-button">
                Guess
              </button>
            </form>
            {inputError && <p className="error-message">{inputError}</p>}
          </>
        )}

        {/* Game Over Message */}
        {gameOver && (
          <div className="game-over-message">
            {hasWon ? (
              <h2 className="win-message">🎉 You Win! 🎉</h2>
            ) : (
              <h2 className="lose-message">
                😢 You Lose! The word was: <span className="revealed-word">{currWord}</span>
              </h2>
            )}
            <button onClick={startNewRound} className="play-again-button">
              Play Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;