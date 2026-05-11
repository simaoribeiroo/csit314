import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserState } from '../providers/UserProvider'

function LoginForm() {
  const navigate = useNavigate()
  const userState = useUserState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Login failed')
        return
      }

      userState.setUser({
        email: data.email,
        accountType: data.account_type,
      })

      if (data.account_type === 'candidate') {
        navigate('/search-jobs')
        return
      }

      if (data.account_type === 'company') {
        navigate('/search-candidates')
        return
      }

      navigate('/profile')
    } catch {
      setError('Unable to reach the login service')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error ? <p className="login-error" role="alert">{error}</p> : null}
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
