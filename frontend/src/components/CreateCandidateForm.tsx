import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateCandidateForm() {
  const navigate = useNavigate()
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [university, setUniversity] = useState('')
  const [degreeName, setDegreeName] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [preferredWorkingMode, setPreferredWorkingMode] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.setCustomValidity('')
    }
  }

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (!trimmedSkill) {
      return
    }

    setSkills((currentSkills) => [...currentSkills, trimmedSkill])
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((currentSkills) => currentSkills.filter((skill) => skill !== skillToRemove))
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
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

    console.log('Create candidate account:', {
      firstName,
      lastName,
      email,
      phoneNumber,
      university,
      degreeName,
      yearsOfExperience,
      skills,
      preferredWorkingMode,
      preferredLocation,
      password,
      confirmPassword,
    })
    navigate('/search-jobs')
  }

  return (
    <div className="login-container candidate-container">
      <div className="login-card candidate-card">
        <h2 className="login-title">Create a candidate account</h2>

        <form onSubmit={handleSubmit} className="login-form candidate-form">
          <div className="candidate-grid two-column">
            <div className="form-group">
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="candidate-grid two-column">
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
              <label htmlFor="phone-number">Phone number</label>
              <input
                id="phone-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder="04XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                title="Phone number must contain exactly 10 digits"
                required
              />
            </div>
          </div>

          <div className="candidate-grid">
            <div className="form-group">
              <label htmlFor="university">University</label>
              <input
                id="university"
                type="text"
                placeholder="University"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="degree-name">Degree name</label>
              <input
                id="degree-name"
                type="text"
                placeholder="Degree name"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="candidate-grid">
            <div className="form-group">
              <label htmlFor="years-of-experience">Years of experience</label>
              <input
                id="years-of-experience"
                type="number"
                min="0"
                step="1"
                placeholder="i.e. 5"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skill-input">Skills</label>
            <div className="skill-input-row">
              <input
                id="skill-input"
                type="text"
                placeholder="Skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <button type="button" className="skill-add-button" onClick={handleAddSkill} aria-label="Add skill">
                +
              </button>
            </div>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <button
                  key={`${skill}-${index}`}
                  type="button"
                  className="skill-chip"
                  onClick={() => handleRemoveSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  {skill}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          </div>

          <div className="candidate-grid two-column">
            <div className="form-group">
              <label htmlFor="preferred-working-mode">Preferred Working Mode</label>
              <select
                id="preferred-working-mode"
                value={preferredWorkingMode}
                onChange={(e) => setPreferredWorkingMode(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select working mode
                </option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferred-location">Preferred Location</label>
              <input
                id="preferred-location"
                type="text"
                placeholder="Preferred Location"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                required
              />
            </div>
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
          <button type="button" className="login-footer-link" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCandidateForm
