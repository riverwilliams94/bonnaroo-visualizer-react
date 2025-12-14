import { useState } from 'react'
import Header from './components/Header'
import Overview from './components/Overview'
import YearComparison from './components/YearComparison'
import ArtistTimeline from './components/ArtistTimeline'
import YearScrubber from './components/YearScrubber'
import GuessTheYear from './components/GuessTheYear'
import GenreBubbles from './components/GenreBubbles'
import PosterMaker from './components/PosterMaker'
import MyYears from './components/MyYears'
import SurpriseMe from './components/SurpriseMe'
import GenreDive from './components/GenreDive'

function App() {
  const [activeFeature, setActiveFeature] = useState('overview')
  const [includeCancelled, setIncludeCancelled] = useState(true)
  const [includePartial, setIncludePartial] = useState(true)

  const features = [
    { id: 'overview', label: '📊 Overview', component: Overview },
    { id: 'comparison', label: '⚖️ Compare Years', component: YearComparison },
    { id: 'timeline', label: '🎤 Artist Timeline', component: ArtistTimeline },
    { id: 'scrubber', label: '🎬 Year Scrubber', component: YearScrubber },
    { id: 'game', label: '🎮 Guess the Year', component: GuessTheYear },
    { id: 'bubbles', label: '🫧 Genre Bubbles', component: GenreBubbles },
    { id: 'poster', label: '🎨 Poster Maker', component: PosterMaker },
    { id: 'myyears', label: '📅 My Years', component: MyYears },
    { id: 'surprise', label: '🎲 Surprise Me', component: SurpriseMe },
    { id: 'genres', label: '🎵 Genre Dive', component: GenreDive },
  ]

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component

  return (
    <>
      <div className="bg-gradient"></div>

      <Header
        features={features}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        includeCancelled={includeCancelled}
        setIncludeCancelled={setIncludeCancelled}
        includePartial={includePartial}
        setIncludePartial={setIncludePartial}
      />

      <div className="feature-section active">
        {ActiveComponent && (
          <ActiveComponent
            includeCancelled={includeCancelled}
            includePartial={includePartial}
          />
        )}
      </div>
    </>
  )
}

export default App
