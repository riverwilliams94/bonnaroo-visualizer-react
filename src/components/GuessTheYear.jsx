import { useState, useMemo } from 'react'
import { getFilteredYears } from '../utils/dataUtils'

export default function GuessTheYear({ includeCancelled, includePartial }) {
  const filteredYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial),
    [includeCancelled, includePartial]
  )

  const [gameState, setGameState] = useState('idle') // idle, playing, answered
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [currentYear, setCurrentYear] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const startGame = () => {
    setScore(0)
    setRound(0)
    nextRound()
  }

  const nextRound = () => {
    if (filteredYears.length < 4) {
      alert('Not enough years available to play the game')
      return
    }

    // Pick a random year
    const randomYear = filteredYears[Math.floor(Math.random() * filteredYears.length)]

    // Generate 3 other random years as options
    const wrongOptions = []
    while (wrongOptions.length < 3) {
      const randomOption = filteredYears[Math.floor(Math.random() * filteredYears.length)]
      if (randomOption.year !== randomYear.year && !wrongOptions.includes(randomOption.year)) {
        wrongOptions.push(randomOption.year)
      }
    }

    // Shuffle options
    const allOptions = [randomYear.year, ...wrongOptions].sort(() => Math.random() - 0.5)

    setCurrentYear(randomYear)
    setOptions(allOptions)
    setGameState('playing')
    setSelectedAnswer(null)
    setRound(prev => prev + 1)
  }

  const handleGuess = year => {
    setSelectedAnswer(year)
    setGameState('answered')

    if (year === currentYear.year) {
      setScore(prev => prev + 1)
    }
  }

  const continueGame = () => {
    if (round < 10) {
      nextRound()
    } else {
      setGameState('finished')
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">🎮 Guess the Year Game</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Test your Bonnaroo knowledge! Can you guess the year from the lineup?
      </p>

      <div className="game-card">
        {gameState !== 'idle' && gameState !== 'finished' && (
          <div className="game-score">
            Score: <span>{score}</span> / <span>{round}</span>
          </div>
        )}

        {gameState === 'idle' && (
          <div>
            <button className="btn btn-primary" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div>
            <h3 style={{ color: 'var(--accent-green)', marginBottom: '20px', fontSize: '2rem' }}>
              Game Over!
            </h3>
            <div className="stat-box" style={{ maxWidth: '300px', margin: '0 auto' }}>
              <div className="stat-number">{score}/10</div>
              <div className="stat-label">Final Score</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={startGame}
              style={{ marginTop: '30px' }}
            >
              Play Again
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'answered') && currentYear && (
          <div>
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-blue)' }}>
              Round {round} / 10
            </h3>
            <div className="lineup-preview">
              <h4 style={{ marginBottom: '15px', color: 'var(--accent-orange)' }}>
                Guess the year from these artists:
              </h4>
              {currentYear.artists &&
                currentYear.artists.slice(0, 10).map((artist, i) => (
                  <div key={i} className="artist-list-item">
                    {artist.name}
                  </div>
                ))}
            </div>

            <div className="guess-options">
              {options.map(year => (
                <button
                  key={year}
                  className={`guess-btn ${
                    selectedAnswer === year
                      ? year === currentYear.year
                        ? 'correct'
                        : 'incorrect'
                      : selectedAnswer && year === currentYear.year
                      ? 'correct'
                      : ''
                  }`}
                  onClick={() => gameState === 'playing' && handleGuess(year)}
                  disabled={gameState === 'answered'}
                >
                  {year}
                </button>
              ))}
            </div>

            {gameState === 'answered' && (
              <div style={{ marginTop: '30px' }}>
                {selectedAnswer === currentYear.year ? (
                  <p style={{ color: 'var(--accent-green)', fontSize: '1.3rem', fontWeight: '600' }}>
                    ✅ Correct! It was {currentYear.year}!
                  </p>
                ) : (
                  <p style={{ color: 'var(--accent-pink)', fontSize: '1.3rem', fontWeight: '600' }}>
                    ❌ Wrong! The answer was {currentYear.year}
                  </p>
                )}
                <button
                  className="btn btn-primary"
                  onClick={continueGame}
                  style={{ marginTop: '20px' }}
                >
                  {round < 10 ? 'Next Round' : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
