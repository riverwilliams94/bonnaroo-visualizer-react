import { useState, useMemo } from 'react'
import { getFilteredYears, getYearData } from '../utils/dataUtils'

export default function PosterMaker({ includeCancelled, includePartial }) {
  const availableYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial).map(y => y.year),
    [includeCancelled, includePartial]
  )

  const [selectedYear, setSelectedYear] = useState(
    availableYears[availableYears.length - 1] || 2024
  )

  const yearData = useMemo(() => getYearData(selectedYear), [selectedYear])

  const groupByTier = artists => {
    if (!artists) return { headliner: [], subheadliner: [], undercard: [] }

    return {
      headliner: artists.filter(a => a.tier === 'headliner'),
      subheadliner: artists.filter(a => a.tier === 'subheadliner'),
      undercard: artists.filter(a => a.tier === 'undercard'),
    }
  }

  const tiers = useMemo(() => groupByTier(yearData?.artists), [yearData])

  return (
    <div className="card">
      <h2 className="card-title">🎨 Festival Poster Generator</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Create vintage-style festival posters for any year.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Select Year:
        </label>
        <select
          className="year-selector"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {yearData && (
        <div className="poster-preview">
          <div className="poster-header">BONNAROO</div>
          <div className="poster-year">{yearData.year}</div>

          <div className="poster-artists">
            {tiers.headliner.length > 0 && (
              <div className="poster-tier headliner">
                {tiers.headliner.map(a => a.name).join(' • ')}
              </div>
            )}

            {tiers.subheadliner.length > 0 && (
              <div className="poster-tier subheadliner">
                {tiers.subheadliner.slice(0, 10).map(a => a.name).join(' • ')}
              </div>
            )}

            {tiers.undercard.length > 0 && (
              <div className="poster-tier undercard">
                {tiers.undercard.slice(0, 30).map(a => a.name).join(' • ')}
                {tiers.undercard.length > 30 && ' • and more...'}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        className="btn btn-primary"
        style={{ marginTop: '20px' }}
        onClick={() => alert('Poster download feature - use browser screenshot for now!')}
      >
        Download Poster
      </button>
    </div>
  )
}
