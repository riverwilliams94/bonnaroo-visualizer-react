# Bonnaroo Visualizer - React App

A modern React application for exploring 25 years of Bonnaroo Music Festival data with interactive visualizations and tools.

## Project Structure

```
bonnaroo-visualizer-react/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # Main header with navigation
│   │   ├── Overview.jsx     # Data overview & stats
│   │   ├── YearComparison.jsx
│   │   ├── ArtistTimeline.jsx
│   │   ├── YearScrubber.jsx
│   │   ├── GuessTheYear.jsx
│   │   ├── GenreBubbles.jsx
│   │   ├── PosterMaker.jsx
│   │   ├── MyYears.jsx
│   │   ├── SurpriseMe.jsx
│   │   └── GenreDive.jsx
│   ├── data/
│   │   └── bonnaroo_data.json  # Festival data (see below)
│   ├── utils/
│   │   └── dataUtils.js     # Data helper functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── package.json
└── vite.config.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Data

Replace the placeholder `src/data/bonnaroo_data.json` with your actual bonnaroo_data.json file.

The expected data structure is:

```json
{
  "data": {
    "years": [
      {
        "year": 2024,
        "artists": [
          {
            "name": "Artist Name",
            "tier": "headliner",
            "genre": "rock",
            "rollover": false
          }
        ],
        "genres": {
          "rock": 20,
          "electronic": 15,
          "hiphop": 10
        }
      }
    ]
  }
}
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Features

- **Overview**: Data statistics and genre evolution chart
- **Compare Years**: Side-by-side year comparison
- **Artist Timeline**: Search for any artist's Bonnaroo history
- **Year Scrubber**: Animated timeline with genre trends
- **Guess the Year**: Interactive game to test your knowledge
- **Genre Bubbles**: Bubble visualization of genres
- **Poster Maker**: Generate vintage-style festival posters
- **My Years**: Track which years you attended
- **Surprise Me**: Random Bonnaroo facts
- **Genre Dive**: Deep dive into each genre

## Technologies

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Chart.js** - Data visualizations
- **react-chartjs-2** - React wrapper for Chart.js

## Next Steps

The current implementation provides the basic structure with all components created. To complete the app:

1. **Implement Chart.js visualizations** in Overview, YearScrubber, and GenreBubbles components
2. **Add interactive functionality** to YearComparison, ArtistTimeline, and other features
3. **Implement game logic** for GuessTheYear
4. **Add poster generation** logic in PosterMaker
5. **Implement surprise facts** generator in SurpriseMe

## Data Utilities

The `src/utils/dataUtils.js` file provides helper functions:

- `getFilteredYears(includeCancelled, includePartial)` - Get years based on filters
- `getYearData(year)` - Get data for a specific year
- `getAllYears()` - Get all available years
- `getArtistAppearances(artistName)` - Get all appearances of an artist
- `getGenreTopArtists(genreKey)` - Get top artists for a genre
- `calculateOverviewStats()` - Calculate overview statistics

## Styling

All styles are in `src/index.css` using CSS custom properties (variables) for theming:

- Dark theme with vibrant accent colors
- Responsive design with mobile support
- Gradient animations and hover effects
- Google Fonts: Space Grotesk, Permanent Marker, JetBrains Mono
