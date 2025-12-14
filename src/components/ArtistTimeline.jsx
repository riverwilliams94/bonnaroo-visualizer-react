import { useState } from 'react'
import { getArtistAppearances } from '../utils/dataUtils'

export default function ArtistTimeline({ includeCancelled, includePartial }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [appearances, setAppearances] = useState([])

  const handleSearch = e => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      const results = getArtistAppearances(query)
      setAppearances(results)
    } else {
      setAppearances([])
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">🎤 Artist Journey Timeline</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Search for any artist to see their complete Bonnaroo history.
      </p>

      <input
        type="text"
        className="timeline-search"
        placeholder="Search for an artist (e.g., 'Radiohead', 'Foo Fighters')..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {appearances.length > 0 && (
        <div>
          <h3
            style={{
              color: 'var(--accent-blue)',
              marginTop: '30px',
              marginBottom: '20px',
            }}
          >
            Found {appearances.length} appearance{appearances.length !== 1 ? 's' : ''}
          </h3>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            {appearances.map((appearance, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4 style={{ color: 'var(--accent-orange)', marginBottom: '10px' }}>
                    {appearance.year}
                  </h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                    {appearance.name}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        background: 'var(--accent-blue)',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      {appearance.tier}
                    </span>
                    {appearance.genre && (
                      <span
                        style={{
                          padding: '4px 12px',
                          background: 'var(--accent-purple)',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        {appearance.genre}
                      </span>
                    )}
                    {appearance.rollover && (
                      <span
                        style={{
                          padding: '4px 12px',
                          background: 'var(--accent-yellow)',
                          color: 'var(--bg-dark)',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        Rollover
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery.length >= 2 && appearances.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-secondary)',
          }}
        >
          No artists found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
