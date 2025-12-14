import { useState, useMemo, useEffect, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { getFilteredYears, GENRE_NAMES } from '../utils/dataUtils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function YearScrubber({ includeCancelled, includePartial }) {
  const filteredYears = useMemo(
    () => getFilteredYears(includeCancelled, includePartial),
    [includeCancelled, includePartial]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const currentYear = filteredYears[currentIndex]

  const chartData = useMemo(() => {
    if (!currentYear) return null

    const genreKeys = Object.keys(GENRE_NAMES)
    const colors = [
      '#ff6b35',
      '#00d4ff',
      '#9933ff',
      '#00ff88',
      '#ffcc00',
      '#ff3366',
      '#00ccff',
      '#ff9933',
    ]

    return {
      labels: genreKeys.map(key => GENRE_NAMES[key]),
      datasets: [
        {
          label: 'Artists by Genre',
          data: genreKeys.map(key => currentYear.genres?.[key] || 0),
          backgroundColor: colors,
          borderColor: colors.map(c => c + 'ff'),
          borderWidth: 2,
        },
      ],
    }
  }, [currentYear])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#12121a',
        titleColor: '#ffffff',
        bodyColor: '#a0a0b0',
        borderColor: '#00d4ff',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        ticks: {
          color: '#a0a0b0',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        ticks: {
          color: '#a0a0b0',
        },
      },
    },
  }

  const handleSliderChange = e => {
    const index = Number(e.target.value)
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= filteredYears.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prevIndex + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, filteredYears.length])

  if (!currentYear) {
    return (
      <div className="card">
        <p style={{ color: 'var(--text-secondary)' }}>No data available</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">🎬 Animated Year Scrubber</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Travel through time and watch genre trends evolve year by year.
      </p>

      <div className="scrubber-container">
        <div className="scrubber-year-display">{currentYear.year}</div>
        <input
          type="range"
          className="scrubber-slider"
          min="0"
          max={filteredYears.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
        />
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      <div style={{ height: '400px', position: 'relative' }}>
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  )
}
