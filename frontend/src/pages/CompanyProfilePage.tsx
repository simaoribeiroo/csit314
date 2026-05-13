import PageScreen from "../components/PageScreen";

function CompanyProfilePage() {
  return (
    <PageScreen
      eyebrow="Company Profile"
      title="Company name"
      description="Manage company information, membership, and posted job listings."
    >
      <div className="profile-actions">
        <button className="login-button">Buy membership</button>
        <button className="login-button">Add job posting +</button>
      </div>

      <section className="profile-section">
        <h2>Company information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor,
          ut lacinia dui tristique nec.
        </p>
      </section>

      <section className="profile-section">
        <h2>Contact information</h2>
        <p>example@email.com</p>
      </section>

      <section className="profile-section">
        <h2>Posted job postings</h2>

        {[1, 2, 3].map((job) => (
          <article className="result-card" key={job}>
            <h2>Job title</h2>
            <p>Company name</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed lorem ut
              mauris facilisis aliquet.
            </p>
            <p>Work mode | Location</p>
          </article>
        ))}
      </section>
    </PageScreen>
  );
}

export default CompanyProfilePage;