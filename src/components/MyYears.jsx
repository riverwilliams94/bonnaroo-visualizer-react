import { useState, useMemo } from 'react'
import { getFilteredYears, GENRE_NAMES } from '../utils/dataUtils'

export default function MyYears({ includeCancelled, includePartial }) {
  const availableYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial),
    [includeCancelled, includePartial]
  )

  const [selectedYears, setSelectedYears] = useState(new Set())

  const toggleYear = year => {
    const newSet = new Set(selectedYears)
    if (newSet.has(year)) {
      newSet.delete(year)
    } else {
      newSet.add(year)
    }
    setSelectedYears(newSet)
  }

  const stats = useMemo(() => {
    const myYearsData = availableYears.filter(y => selectedYears.has(y.year))
    const allArtists = new Set()
    const genreCounts = {}

    myYearsData.forEach(yearData => {
      yearData.artists?.forEach(artist => {
        allArtists.add(artist.name)
        if (artist.genre) {
          genreCounts[artist.genre] = (genreCounts[artist.genre] || 0) + 1
        }
      })
    })

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      yearsAttended: selectedYears.size,
      artistsSeen: allArtists.size,
      topGenre: topGenre ? GENRE_NAMES[topGenre[0]] : 'N/A',
      totalSets: myYearsData.reduce((sum, y) => sum + (y.artists?.length || 0), 0),
    }
  }, [selectedYears, availableYears])

  return (
    <div className="card">
      <h2 className="card-title">📅 My Bonnaroo Years</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Check off the years you attended and see your personalized stats!
      </p>

      <div className="years-grid">
        {availableYears.map(yearData => (
          <div
            key={yearData.year}
            className={`year-checkbox ${selectedYears.has(yearData.year) ? 'selected' : ''}`}
            onClick={() => toggleYear(yearData.year)}
          >
            <input
              type="checkbox"
              checked={selectedYears.has(yearData.year)}
              onChange={() => {}}
            />
            <span>{yearData.year}</span>
          </div>
        ))}
      </div>

      <div className="my-stats-display">
        <h3 style={{ marginBottom: '20px' }}>Your Bonnaroo Statistics</h3>
        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-number">{stats.yearsAttended}</div>
            <div className="stat-label">Years Attended</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.artistsSeen.toLocaleString()}</div>
            <div className="stat-label">Unique Artists Seen</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.totalSets.toLocaleString()}</div>
            <div className="stat-label">Total Sets</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.topGenre}</div>
            <div className="stat-label">Top Genre</div>
          </div>
        </div>
      </div>
    </div>
  )
}
