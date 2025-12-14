import { useMemo } from 'react'
import { Bubble } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { getFilteredYears, GENRE_NAMES } from '../utils/dataUtils'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

export default function GenreBubbles({ includeCancelled, includePartial }) {
  const chartData = useMemo(() => {
    const filteredYears = getFilteredYears(includeCancelled, includePartial)
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

    const datasets = genreKeys.map((genreKey, index) => {
      const data = filteredYears.map((yearData, yearIndex) => ({
        x: yearIndex,
        y: index,
        r: (yearData.genres?.[genreKey] || 0) * 2,
      }))

      return {
        label: GENRE_NAMES[genreKey],
        data,
        backgroundColor: colors[index % colors.length] + '80',
        borderColor: colors[index % colors.length],
        borderWidth: 2,
      }
    })

    return { datasets }
  }, [includeCancelled, includePartial])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
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
        callbacks: {
          label: context => {
            return `${context.dataset.label}: ${Math.round(context.parsed.r / 2)} artists`
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }

  return (
    <div className="card">
      <h2 className="card-title">🫧 Genre Bubble Visualization</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Watch genres bubble and flow through Bonnaroo's history. Bubble size represents number of artists.
      </p>

      <div className="bubble-container">
        <Bubble data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
