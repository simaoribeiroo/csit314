import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateEmployerForm() {
  const navigate = useNavigate()
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [companyInformation, setCompanyInformation] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.setCustomValidity('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.setCustomValidity('Passwords do not match')
        confirmPasswordRef.current.reportValidity()
      }
      return
    }

    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.setCustomValidity('')
    }

    console.log('Create employer account:', {
      companyName,
      email,
      companyInformation,
      password,
      confirmPassword,
    })
    navigate('/search-candidates')
  }

  return (
    <div className="login-container employer-container">
      <div className="login-card employer-card">
        <h2 className="login-title">Create a company account</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="company-name">Company name</label>
            <input
              id="company-name"
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-information">Company information</label>
            <textarea
              id="company-information"
              placeholder="Company information"
              value={companyInformation}
              onChange={(e) => setCompanyInformation(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-input-wrapper">
              <input
                ref={confirmPasswordRef}
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
            Create account
          </button>
        </form>

        <div className="login-footer">
          <span>Already have an account? </span>
          <button
            type="button"
            className="login-footer-link"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateEmployerForm
