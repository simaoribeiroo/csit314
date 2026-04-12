import PageScreen from '../components/PageScreen'

function SearchJobsPage() {
  return (
    <PageScreen
      eyebrow="Discovery"
      title="Search Jobs"
      description="Explore active job listings by role, location, and work arrangement."
    >
      <div className="search-toolbar">
        <input type="search" placeholder="Search roles, companies, or keywords" />
        <button type="button">Search</button>
      </div>
      <div className="result-list">
        <article className="result-card">
          <h2>Senior React Developer</h2>
          <p>Remote · Full-time · Product engineering</p>
        </article>
        <article className="result-card">
          <h2>UI Engineer</h2>
          <p>Hybrid · Contract · Design systems</p>
        </article>
      </div>
    </PageScreen>
  )
}

export default SearchJobsPage
