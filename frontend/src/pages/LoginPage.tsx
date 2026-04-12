import PageScreen from '../components/PageScreen'

function LoginPage() {
  return (
    <PageScreen
      eyebrow="Access"
      title="Login"
      description="Sign in to manage profiles, candidates, employers, and job searches."
    >
      <form className="panel-form">
        <label>
          Email
          <input type="email" name="email" placeholder="name@example.com" />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Enter your password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </PageScreen>
  )
}

export default LoginPage
