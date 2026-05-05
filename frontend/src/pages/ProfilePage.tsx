import PageScreen from '../components/PageScreen'

function ProfilePage() {
  return (
    <PageScreen
      eyebrow="Account"
      title="Profile"
      description="Review your account details and update your public profile information."
    >
      <div className="panel-grid">
        <article className="stat-card">
          <span>Member role</span>
          <strong>Candidate / Employer</strong>
        </article>
        <article className="stat-card">
          <span>Saved searches</span>
          <strong>12</strong>
        </article>
        <article className="stat-card">
          <span>Profile status</span>
          <strong>Complete</strong>
        </article>
      </div>
    </PageScreen>
  )
}

export default ProfilePage
