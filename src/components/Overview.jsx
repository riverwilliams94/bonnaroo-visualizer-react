import { useEffect, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { calculateOverviewStats, getFilteredYears, GENRE_NAMES } from '../utils/dataUtils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Overview({ includeCancelled, includePartial }) {
  const stats = useMemo(
    () => calculateOverviewStats(includeCancelled, includePartial),
    [includeCancelled, includePartial]
  )

  const chartData = useMemo(() => {
    const filteredYears = getFilteredYears(includeCancelled, includePartial)
    const years = filteredYears.map(y => y.year)
    const genreKeys = Object.keys(GENRE_NAMES)

    const datasets = genreKeys.map((genreKey, index) => {
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
      const color = colors[index % colors.length]

      return {
        label: GENRE_NAMES[genreKey],
        data: filteredYears.map(yearData => yearData.genres?.[genreKey] || 0),
        borderColor: color,
        backgroundColor: color + '40',
        tension: 0.4,
      }
    })

    return {
      labels: years,
      datasets,
    }
  }, [includeCancelled, includePartial])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a0a0b0',
          font: {
            family: "'Space Grotesk', sans-serif",
          },
        },
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

  return (
    <div>
      <div className="card">
        <h2 className="card-title">📊 Data Overview</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Explore 25 years of Bonnaroo Music Festival data with interactive visualizations and tools.
        </p>
        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-number">{stats.totalBookings.toLocaleString()}</div>
            <div className="stat-label">Total Artist Bookings</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.uniqueArtists.toLocaleString()}</div>
            <div className="stat-label">Unique Artists</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.repeatArtists.toLocaleString()}</div>
            <div className="stat-label">Artists Who Returned</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.rolloverCount.toLocaleString()}</div>
            <div className="stat-label">Rollover Artists</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.djCount.toLocaleString()}</div>
            <div className="stat-label">DJ Sets</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">🎵 Genre Evolution Over Time</h2>
        <div style={{ height: '400px', position: 'relative' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
