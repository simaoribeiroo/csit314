import PageScreen from '../components/PageScreen'

function CreateCandidatePage() {
  return (
    <PageScreen
      eyebrow="Recruiting"
      title="Create Candidate"
      description="Add a candidate profile with experience, skills, and availability."
    >
      <form className="panel-form two-column">
        <label>
          Full name
          <input type="text" name="fullName" placeholder="Jordan Lee" />
        </label>
        <label>
          Current role
          <input type="text" name="role" placeholder="Frontend Developer" />
        </label>
        <label>
          Key skills
          <input type="text" name="skills" placeholder="React, TypeScript, Figma" />
        </label>
        <label>
          Availability
          <input type="text" name="availability" placeholder="Part-time, remote" />
        </label>
        <button type="submit">Create candidate</button>
      </form>
    </PageScreen>
  )
}

export default CreateCandidatePage
