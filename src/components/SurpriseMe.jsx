import { useState, useMemo } from 'react'
import { getFilteredYears, getGenreTopArtists, GENRE_NAMES } from '../utils/dataUtils'

export default function SurpriseMe({ includeCancelled, includePartial }) {
  const [fact, setFact] = useState(null)

  const filteredYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial),
    [includeCancelled, includePartial]
  )

  const generateFact = () => {
    const facts = []

    // Random year fact
    if (filteredYears.length > 0) {
      const randomYear = filteredYears[Math.floor(Math.random() * filteredYears.length)]
      facts.push(
        `In ${randomYear.year}, Bonnaroo featured ${randomYear.artists?.length || 0} artists!`
      )

      // Top genre for random year
      const genres = randomYear.genres || {}
      const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]
      if (topGenre) {
        facts.push(
          `${GENRE_NAMES[topGenre[0]]} dominated ${randomYear.year} with ${topGenre[1]} artists!`
        )
      }
    }

    // Most frequent artist
    const allArtists = {}
    filteredYears.forEach(y => {
      y.artists?.forEach(a => {
        allArtists[a.name] = (allArtists[a.name] || 0) + 1
      })
    })
    const topArtist = Object.entries(allArtists).sort((a, b) => b[1] - a[1])[0]
    if (topArtist) {
      facts.push(`${topArtist[0]} has performed at Bonnaroo ${topArtist[1]} times!`)
    }

    // Total unique artists
    facts.push(
      `Over ${filteredYears.length} years, ${Object.keys(allArtists).length} unique artists have graced the Bonnaroo stages!`
    )

    // Genre fact
    const genreKeys = Object.keys(GENRE_NAMES)
    const randomGenre = genreKeys[Math.floor(Math.random() * genreKeys.length)]
    const genreArtists = getGenreTopArtists(randomGenre, includeCancelled, includePartial)
    if (genreArtists.length > 0) {
      facts.push(
        `${GENRE_NAMES[randomGenre]} has been represented by ${genreArtists.length} different artists!`
      )
    }

    // Pick random fact
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    setFact(randomFact)
  }

  return (
    <div className="card">
      <div className="surprise-box">
        <button className="surprise-btn" onClick={generateFact}>
          🎲
        </button>
        <div className="surprise-text">
          {fact || 'Click the dice to discover a random Bonnaroo fact!'}
        </div>
      </div>
    </div>
  )
}
