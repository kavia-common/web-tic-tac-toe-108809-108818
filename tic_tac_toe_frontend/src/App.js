import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Blue & amber accents (primary: #2563EB, secondary: #F59E0B)
 * - Error color: #EF4444
 * - Background: #f9fafb
 * - Gradient: subtle from blue to gray
 * - Responsive, centered layout with score on top and restart below grid
 */

// Helpers
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This component renders a fully functional Tic Tac Toe game with:
   * - player-vs-player turns
   * - win/tie detection
   * - in-memory score tracking for X and O (resets on reload)
   * - responsive Ocean Professional styling
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [message, setMessage] = useState('');
  const [winnerLine, setWinnerLine] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isTie = useMemo(() => !winnerInfo && isBoardFull(board), [winnerInfo, board]);

  useEffect(() => {
    if (winnerInfo) {
      setMessage(`Player ${winnerInfo.player} wins!`);
      setWinnerLine(winnerInfo.line);
      setGameOver(true);
      setScores(prev => ({ ...prev, [winnerInfo.player]: prev[winnerInfo.player] + 1 }));
    } else if (isTie) {
      setMessage(`It's a tie!`);
      setWinnerLine([]);
      setGameOver(true);
    } else {
      setMessage(`Player ${currentPlayer}'s turn`);
      setWinnerLine([]);
      setGameOver(false);
    }
  }, [winnerInfo, isTie, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Handles a user clicking a grid square; ignores if occupied or game over. */
    if (board[index] || winnerInfo || gameOver) return;
    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart(keepScore = true) {
    /**
     * Resets the board. If keepScore is false, also reset the score tally.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerLine([]);
    setGameOver(false);
    if (!keepScore) {
      setScores({ X: 0, O: 0 });
    }
  }

  return (
    <div className="app-root">
      <div className="nav-minimal" aria-label="App header">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name">Ocean Tic Tac Toe</span>
        </div>
      </div>

      <main className="container">
        <section className="scoreboard" aria-label="Scoreboard">
          <div className="score-card" role="status" aria-live="polite">
            <div className="score-label">Player X</div>
            <div className="score-value">{scores.X}</div>
          </div>
          <div className="status">
            <div
              className={`status-badge ${winnerInfo ? 'status-win' : isTie ? 'status-tie' : 'status-turn'}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          </div>
          <div className="score-card">
            <div className="score-label">Player O</div>
            <div className="score-value">{scores.O}</div>
          </div>
        </section>

        <section className="board-wrapper" aria-label="Game board">
          <Board
            squares={board}
            onClick={handleSquareClick}
            winnerLine={winnerLine}
            disabled={!!winnerInfo || gameOver}
          />
        </section>

        <section className="controls">
          <button
            className="btn primary"
            onClick={() => handleRestart(true)}
            aria-label="Restart game and keep scores"
          >
            Restart Game
          </button>
          <button
            className="btn secondary"
            onClick={() => handleRestart(false)}
            aria-label="Restart game and reset scores"
          >
            Reset Scores
          </button>
        </section>

        <footer className="footer-hint" aria-label="Footer">
          Tip: Click any cell to place your mark. X starts first.
        </footer>
      </main>
    </div>
  );
}

function Board({ squares, onClick, winnerLine, disabled }) {
  return (
    <div className="board" role="grid" aria-label="3 by 3 Tic Tac Toe grid">
      {squares.map((value, i) => {
        const isWinning = winnerLine.includes(i);
        return (
          <Square
            key={i}
            value={value}
            onClick={() => onClick(i)}
            highlight={isWinning}
            disabled={disabled || !!value}
            ariaLabel={`Cell ${i + 1} ${value ? `contains ${value}` : 'empty'}`}
          />
        );
      })}
    </div>
  );
}

function Square({ value, onClick, highlight, disabled, ariaLabel }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
      role="gridcell"
      aria-label={ariaLabel}
    >
      {value}
    </button>
  );
}
