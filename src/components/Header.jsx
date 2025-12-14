export default function Header({
  features,
  activeFeature,
  setActiveFeature,
  includeCancelled,
  setIncludeCancelled,
  includePartial,
  setIncludePartial
}) {
  const handleDownloadDataset = () => {
    // TODO: Implement dataset download functionality
    alert('Dataset download feature coming soon!')
  }

  return (
    <header>
      <h1 className="logo">BONNAROO</h1>
      <p className="subtitle">Enhanced Interactive Explorer • 2002-2026</p>

      <div className="feature-nav">
        {features.map(feature => (
          <button
            key={feature.id}
            className={`feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
            onClick={() => setActiveFeature(feature.id)}
          >
            {feature.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(18, 18, 26, 0.6)',
          borderRadius: '12px',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '8px 12px',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            fontSize: '0.8rem',
          }}
        >
          <input
            type="checkbox"
            checked={includeCancelled}
            onChange={(e) => setIncludeCancelled(e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px' }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            Include Cancelled Years (2020, 2021)
          </span>
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '8px 12px',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            fontSize: '0.8rem',
          }}
        >
          <input
            type="checkbox"
            checked={includePartial}
            onChange={(e) => setIncludePartial(e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px' }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            Include Partial Year (2025)
          </span>
        </label>

        <button
          onClick={handleDownloadDataset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            border: 'none',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.8rem',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <span>📥 Download Dataset</span>
        </button>
      </div>
    </header>
  )
}
