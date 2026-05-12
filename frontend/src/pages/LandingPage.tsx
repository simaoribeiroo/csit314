import { useNavigate } from 'react-router-dom'
import PageScreen from '../components/PageScreen'

function HomePage() {
  const navigate = useNavigate()

  return (
    <PageScreen
      eyebrow="Welcome"
      title="JobMatch"
      description="Find suitable jobs or candidates using profile details, job descriptions, searching, filtering, and recommendation matching."
    >

      <div className="panel-grid home-grid">
        <article className="stat-card home-card">
          <span>Candidate workflow</span>
          <strong>Get matched with jobs</strong>
          <p>
            Candidates can create a profile with education, major, work experience, skills,
            preferred work mode, and preferred location.
          </p>
          <button
            type="button"
            className="login-button"
            onClick={() => navigate('/search-jobs')}
          >
            Search jobs
          </button>
        </article>

        <article className="stat-card home-card">
          <span>Employer workflow</span>
          <strong>Find suitable candidates</strong>
          <p>
            Companies can create job postings with required education, skills, experience,
            work mode, and job location.
          </p>
          <button
            type="button"
            className="login-button"
            onClick={() => navigate('/search-candidates')}
          >
            Search candidates
          </button>
        </article>
      </div>

    </PageScreen>
  )
}

export default HomePage
