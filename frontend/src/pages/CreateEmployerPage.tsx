import PageScreen from '../components/PageScreen'

function CreateEmployerPage() {
  return (
    <PageScreen
      eyebrow="Recruiting"
      title="Create Employer"
      description="Register an employer profile with company details and hiring focus."
    >
      <form className="panel-form two-column">
        <label>
          Company name
          <input type="text" name="companyName" placeholder="Northwind Studio" />
        </label>
        <label>
          Industry
          <input type="text" name="industry" placeholder="Technology" />
        </label>
        <label>
          Contact email
          <input type="email" name="email" placeholder="hiring@company.com" />
        </label>
        <label>
          Hiring focus
          <input type="text" name="focus" placeholder="Engineering, product" />
        </label>
        <button type="submit">Create employer</button>
      </form>
    </PageScreen>
  )
}

export default CreateEmployerPage
