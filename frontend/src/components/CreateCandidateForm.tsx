import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserState } from '../providers/UserProvider'
import { useCandidateState } from '../providers/CandidateProvider'
import { useUserRedirect, createConfirmPasswordHandler } from '../utils/forms'
import AuthCard from './common/AuthCard'
import PasswordField from './common/PasswordField'
import FormField from './common/FormField'

function CreateCandidateForm() {
  const navigate = useNavigate()
  const userState = useUserState()
  const candidateState = useCandidateState()
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
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useUserRedirect(navigate, userState)

  const handleConfirmPasswordChange = createConfirmPasswordHandler(
    setConfirmPassword,
    confirmPasswordRef,
  )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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

    setIsSubmitting(true)

    try {
      const accountResponse = await fetch('/api/register-account/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, account_type: 'candidate' }),
      })

      const accountData = await accountResponse.json().catch(() => ({}))

      if (!accountResponse.ok) {
        setError(accountData.error ?? 'Unable to create account')
        return
      }

      const candidateResponse = await fetch('/api/register-candidate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          full_name: `${firstName} ${lastName}`.trim(),
          phone_number: phoneNumber,
          university,
          degree_name: degreeName,
          years_of_experience: yearsOfExperience,
          skills,
          preferred_working_mode: preferredWorkingMode,
          preferred_location: preferredLocation,
        }),
      })

      const candidateData = await candidateResponse.json().catch(() => ({}))

      if (!candidateResponse.ok) {
        setError(candidateData.error ?? 'Unable to create candidate profile')
        return
      }

      userState.setUser({
        email: candidateData.email ?? accountData.email ?? email,
        accountType: candidateData.account_type ?? accountData.account_type ?? 'candidate',
      })

      candidateState.setCandidate({
        email: candidateData.email ?? accountData.email ?? email,
        fullName: `${firstName} ${lastName}`.trim(),
        phoneNumber,
        university,
        degreeName,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        skills,
        preferredWorkingMode,
        preferredLocation,
        isMember: false,
      })

      navigate('/search-jobs')
    } catch {
      setError('Unable to reach the registration service')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      containerClass="login-container"
      cardClass="login-card candidate-card"
      title="Create a candidate account"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Creating account...' : 'Create account'}
      isSubmitting={isSubmitting}
      error={error}
      footer={(
        <>
          <span>Already have an account? </span>
          <button type="button" className="login-footer-link" onClick={() => navigate('/login')}>
            Login
          </button>
        </>
      )}
    >
      <div className="candidate-grid two-column">
        <FormField id="first-name" label="First name" as="input" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="" />

        <FormField id="last-name" label="Last name" as="input" type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="" />
      </div>

      <div className="candidate-grid two-column">
        <FormField id="email" label="Email" as="input" type="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <FormField id="phone-number" label="Phone number" as="input" type="text" placeholder="04XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
      </div>

      <div className="candidate-grid">
        <FormField id="university" label="University" as="input" type="text" placeholder="University" value={university} onChange={(e) => setUniversity(e.target.value)} required />

        <FormField id="degree-name" label="Degree name" as="input" type="text" placeholder="Degree name" value={degreeName} onChange={(e) => setDegreeName(e.target.value)} required />
      </div>

      <div className="candidate-grid">
        <FormField id="years-of-experience" label="Years of experience" as="input" type="number" placeholder="i.e. 5" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} required />
      </div>

      <FormField id="skill-input" label="Skills">
        <div className="skill-input-row">
          <input id="skill-input" type="text" placeholder="Skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} />
          <button type="button" className="skill-add-button" onClick={handleAddSkill} aria-label="Add skill">+</button>
        </div>
        <div className="skills-list">
          {skills.map((skill, index) => (
            <button key={`${skill}-${index}`} type="button" className="skill-chip" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
              {skill}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      </FormField>

      <div className="candidate-grid two-column">
        <FormField id="preferred-working-mode" label="Preferred Working Mode" as="select" value={preferredWorkingMode} onChange={(e) => setPreferredWorkingMode(e.target.value)} required options={[{ value: 'Remote', label: 'Remote' }, { value: 'On-site', label: 'On-site' }, { value: 'Hybrid', label: 'Hybrid' }]} placeholder="Select working mode" />

        <FormField id="preferred-location" label="Preferred Location" as="input" type="text" placeholder="Preferred Location" value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)} required />
      </div>

      <FormField id="password" label="Password">
        <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      </FormField>

      <FormField id="confirm-password" label="Confirm password">
        <PasswordField ref={confirmPasswordRef} id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm password" required />
      </FormField>
    </AuthCard>
  )
}

export default CreateCandidateForm
