import { useState, useMemo } from 'react'
import { getFilteredYears, getYearData, getTopGenre, GENRE_NAMES } from '../utils/dataUtils'

export default function YearComparison({ includeCancelled, includePartial }) {
  const availableYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial).map(y => y.year),
    [includeCancelled, includePartial]
  )

  const [year1, setYear1] = useState(availableYears[availableYears.length - 1] || 2024)
  const [year2, setYear2] = useState(availableYears[availableYears.length - 2] || 2023)

  const year1Data = useMemo(() => getYearData(year1), [year1])
  const year2Data = useMemo(() => getYearData(year2), [year2])

  const comparison = useMemo(() => {
    if (!year1Data || !year2Data) return null

    const artists1 = new Set(year1Data.artists?.map(a => a.name) || [])
    const artists2 = new Set(year2Data.artists?.map(a => a.name) || [])

    const sharedArtists = [...artists1].filter(a => artists2.has(a))
    const uniqueToYear1 = [...artists1].filter(a => !artists2.has(a))
    const uniqueToYear2 = [...artists2].filter(a => !artists1.has(a))

    return {
      sharedArtists,
      uniqueToYear1,
      uniqueToYear2,
      totalYear1: year1Data.artists?.length || 0,
      totalYear2: year2Data.artists?.length || 0,
      topGenreYear1: getTopGenre(year1Data),
      topGenreYear2: getTopGenre(year2Data),
    }
  }, [year1Data, year2Data])

  const renderArtistList = (artists, isShared = false) => {
    return artists.slice(0, 20).map((artist, i) => (
      <div
        key={i}
        className={`artist-list-item ${isShared ? 'shared-artist' : ''}`}
        style={{
          padding: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          background: isShared ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
        }}
      >
        {artist}
      </div>
    ))
  }

  return (
    <div className="card">
      <h2 className="card-title">⚖️ Compare Two Years Side-by-Side</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Select two years to see how lineups, genres, and artists compare.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Year 1:
          </label>
          <select
            className="year-selector"
            value={year1}
            onChange={e => setYear1(Number(e.target.value))}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Year 2:
          </label>
          <select
            className="year-selector"
            value={year2}
            onChange={e => setYear2(Number(e.target.value))}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <div>
          <div className="stat-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-box">
              <div className="stat-number">{comparison.sharedArtists.length}</div>
              <div className="stat-label">Shared Artists</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{comparison.totalYear1}</div>
              <div className="stat-label">{year1} Total Artists</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{comparison.totalYear2}</div>
              <div className="stat-label">{year2} Total Artists</div>
            </div>
          </div>

          <div className="comparison-grid">
            <div className="comparison-column">
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>
                {year1} Lineup
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Top Genre: {comparison.topGenreYear1}
              </p>
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                {year1Data.artists && renderArtistList(year1Data.artists.map(a => a.name))}
              </div>
            </div>

            <div className="comparison-column">
              <h3 style={{ color: 'var(--accent-purple)', marginBottom: '15px' }}>
                {year2} Lineup
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Top Genre: {comparison.topGenreYear2}
              </p>
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                {year2Data.artists && renderArtistList(year2Data.artists.map(a => a.name))}
              </div>
            </div>
          </div>

          {comparison.sharedArtists.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'var(--accent-green)', marginBottom: '15px' }}>
                🤝 Shared Artists ({comparison.sharedArtists.length})
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                }}
              >
                {comparison.sharedArtists.map((artist, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px',
                      background: 'rgba(0, 255, 136, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--accent-green)',
                    }}
                  >
                    {artist}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
