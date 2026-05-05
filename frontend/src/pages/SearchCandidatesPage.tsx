import PageScreen from '../components/PageScreen'

function SearchCandidatesPage() {
  return (
    <PageScreen
      eyebrow="Discovery"
      title="Search Candidates"
      description="Filter candidate profiles by skills, experience, and location."
    >
      <div className="search-toolbar">
        <input type="search" placeholder="Search skills, titles, or availability" />
        <button type="button">Search</button>
      </div>
      <div className="result-list">
        <article className="result-card">
          <h2>Alex Morgan</h2>
          <p>React · TypeScript · Remote</p>
        </article>
        <article className="result-card">
          <h2>Priya Shah</h2>
          <p>Product design · Research · Hybrid</p>
        </article>
      </div>
    </PageScreen>
  )
}

export default SearchCandidatesPage
