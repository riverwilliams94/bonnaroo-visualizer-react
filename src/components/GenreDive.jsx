import { useMemo, useState } from 'react'
import { getFilteredYears, getGenreTopArtists, GENRE_NAMES } from '../utils/dataUtils'

export default function GenreDive({ includeCancelled, includePartial }) {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const genreStats = useMemo(() => {
    const filteredYears = getFilteredYears(includeCancelled, includePartial)
    const genreKeys = Object.keys(GENRE_NAMES)

    return genreKeys.map(key => {
      const topArtists = getGenreTopArtists(key, includeCancelled, includePartial)
      const totalCount = filteredYears.reduce(
        (sum, y) => sum + (y.genres?.[key] || 0),
        0
      )

      return {
        key,
        name: GENRE_NAMES[key],
        totalArtists: totalCount,
        uniqueArtists: topArtists.length,
        topArtists: topArtists.slice(0, 10),
      }
    })
  }, [includeCancelled, includePartial])

  return (
    <div className="card">
      <h2 className="card-title">🎵 Genre Deep Dive</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Explore each genre's journey through Bonnaroo history.
      </p>

      <div className="genre-grid">
        {genreStats.map(genre => (
          <div
            key={genre.key}
            className="genre-card"
            onClick={() =>
              setSelectedGenre(selectedGenre === genre.key ? null : genre.key)
            }
          >
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '10px' }}>
              {genre.name}
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>
              {genre.totalArtists}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Total Artist Bookings
            </p>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                marginTop: '8px',
              }}
            >
              {genre.uniqueArtists} unique artists
            </p>

            {selectedGenre === genre.key && genre.topArtists.length > 0 && (
              <div className="genre-artist-list">
                {genre.topArtists.map((artist, i) => (
                  <div key={i} className="genre-artist-item">
                    <strong>{artist.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {artist.years.length} appearance{artist.years.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
