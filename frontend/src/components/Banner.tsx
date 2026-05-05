import { useNavigate } from 'react-router-dom'

function Banner() {
  const navigate = useNavigate()

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-brand">
          <span className="banner-title">Job</span>
          <span className="banner-title accent">Match</span>
        </div>
        <button 
          className="banner-user-btn" 
          onClick={() => navigate('/profile')}
          aria-label="User menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Banner
