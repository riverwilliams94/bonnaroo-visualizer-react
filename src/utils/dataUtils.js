import bonnarooData from '../data/bonnaroo_data.json'

export const GENRE_NAMES = {
  electronic_edm: 'Electronic/EDM',
  indie_alt: 'Indie/Alternative',
  hiphop_rap: 'Hip-Hop/Rap',
  rock_metal_punk: 'Rock/Metal/Punk',
  folk_americana_country: 'Folk/Americana/Country',
  rnb_soul_funk: 'R&B/Soul/Funk',
  jam_psych_other: 'Jam/Psych/Other',
  pop: 'Pop',
}

// Add festival status to years
bonnarooData.data.years.forEach(y => {
  if (y.year === 2020) {
    y.festival_status = 'cancelled_announced'
  } else if (y.year === 2021) {
    y.festival_status = 'cancelled_after_start'
  } else if (y.year === 2025) {
    y.festival_status = 'partial_cancellation'
  }
})

export function getFilteredYears(includeCancelled = true, includePartial = true) {
  return bonnarooData.data.years.filter(y => {
    if (!includeCancelled && (y.festival_status === 'cancelled_announced' || y.festival_status === 'cancelled_after_start')) {
      return false
    }
    if (!includePartial && y.festival_status === 'partial_cancellation') {
      return false
    }
    return true
  })
}

export function getYearData(year) {
  return bonnarooData.data.years.find(y => y.year === year)
}

export function getAllYears() {
  return bonnarooData.data.years.map(y => y.year)
}

export function getArtistAppearances(artistName) {
  const appearances = []
  bonnarooData.data.years.forEach(yearData => {
    const artist = yearData.artists?.find(a =>
      a.name.toLowerCase().includes(artistName.toLowerCase())
    )
    if (artist) {
      appearances.push({ year: yearData.year, ...artist })
    }
  })
  return appearances
}

export function getGenreTopArtists(genreKey, includeCancelled = true, includePartial = true) {
  const artistCounts = {}
  getFilteredYears(includeCancelled, includePartial).forEach(yearData => {
    yearData.artists?.filter(a => a.genre === genreKey).forEach(artist => {
      if (!artistCounts[artist.name]) {
        artistCounts[artist.name] = { name: artist.name, years: [], tier: artist.tier }
      }
      artistCounts[artist.name].years.push(yearData.year)
    })
  })
  return Object.values(artistCounts).sort((a, b) => b.years.length - a.years.length)
}

export function getTopGenre(yearData) {
  const genres = yearData.genres || {}
  let topGenre = ''
  let maxVal = 0
  Object.entries(genres).forEach(([key, val]) => {
    if (val > maxVal) {
      maxVal = val
      topGenre = key
    }
  })
  return GENRE_NAMES[topGenre] || topGenre
}

export function calculateOverviewStats(includeCancelled = true, includePartial = true) {
  const allYears = bonnarooData.data.years
  const filteredYears = getFilteredYears(includeCancelled, includePartial)

  let totalBookings = 0
  const uniqueArtists = new Set()
  const artistAppearances = {}
  let djCount = 0
  let rolloverCount = 0

  // Calculate rollovers: artists from cancelled years that appear the following year
  const cancelledYears = [2020, 2021, 2025]
  cancelledYears.forEach(cancelledYear => {
    const cancelledYearData = allYears.find(y => y.year === cancelledYear)
    const nextYearData = allYears.find(y => y.year === cancelledYear + 1)

    if (cancelledYearData && nextYearData) {
      const cancelledArtists = new Set(cancelledYearData.artists?.map(a => a.name) || [])
      const nextYearArtists = nextYearData.artists?.map(a => a.name) || []

      nextYearArtists.forEach(artist => {
        if (cancelledArtists.has(artist)) {
          rolloverCount++
        }
      })
    }
  })

  filteredYears.forEach(yearData => {
    if (yearData.artists) {
      totalBookings += yearData.artists.length
      yearData.artists.forEach(artist => {
        uniqueArtists.add(artist.name)
        artistAppearances[artist.name] = (artistAppearances[artist.name] || 0) + 1
        if (artist.is_dj) {
          djCount++
        }
      })
    }
  })

  const repeatBookings = totalBookings - uniqueArtists.size
  const repeatArtists = Object.values(artistAppearances).filter(count => count > 1).length

  return {
    totalBookings,
    uniqueArtists: uniqueArtists.size,
    repeatBookings,
    repeatArtists,
    djCount,
    rolloverCount,
  }
}

export { bonnarooData }
