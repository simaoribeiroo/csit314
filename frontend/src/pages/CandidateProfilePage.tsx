import PageScreen from "../components/PageScreen";

function CandidateProfilePage() {
  return (
    <PageScreen
      eyebrow="Candidate Profile"
      title="Candidate name"
      description="View candidate profile details, skills, experience, and membership status."
    >
      <div className="profile-actions">
        <button className="login-button">Buy membership</button>
      </div>

      <section className="profile-section">
        <h2>Email</h2>
        <p>example@email.com</p>
      </section>

      <section className="profile-grid">
        <div>
          <h2>Phone</h2>
          <p>04XXXXXXXX</p>
        </div>

        <div>
          <h2>YOE</h2>
          <p>5</p>
        </div>

        <div>
          <h2>Degree name</h2>
          <p>Degree name</p>
        </div>

        <div>
          <h2>University attended</h2>
          <p>University of Wollongong</p>
        </div>

        <div>
          <h2>Skills</h2>
          <p>Skill 1, Skill 2, Skill 3</p>
        </div>

        <div>
          <h2>Preferred work mode</h2>
          <p>Hybrid</p>
        </div>

        <div>
          <h2>Preferred location</h2>
          <p>Sydney</p>
        </div>
      </section>
    </PageScreen>
  );
}

export default CandidateProfilePage;