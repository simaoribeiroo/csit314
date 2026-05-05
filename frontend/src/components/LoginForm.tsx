import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add account type detection logic here
    // For now, redirect to search-jobs
    console.log('Login attempt:', { email, password })
    navigate('/search-jobs')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '✕' : '○'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-footer">
          <span>Sign up as </span>
          <button
            type="button"
            className="login-footer-link"
            onClick={() => navigate('/create-employer')}
          >
            company
          </button>
          <span> | </span>
          <button
            type="button"
            className="login-footer-link"
            onClick={() => navigate('/create-candidate')}
          >
            candidate
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
