import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserState } from '../providers/UserProvider'
import { useCompanyState } from '../providers/CompanyProvider'
import { useCandidateState } from '../providers/CandidateProvider'
import { useUserRedirect } from '../utils/forms'
import AuthCard from './common/AuthCard'
import PasswordField from './common/PasswordField'
import FormField from './common/FormField'

function LoginForm() {
  const navigate = useNavigate()
  const userState = useUserState()
  const companyState = useCompanyState()
  const candidateState = useCandidateState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const [error, setError] = useState('')

  useUserRedirect(navigate, userState)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
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

      localStorage.setItem('email', data.email)
      localStorage.setItem('account_type', data.account_type)
      // fetch full profile for company or candidate if available
      if (data.account_type === 'company') {
        try {
          const resp = await fetch(`/api/company/${encodeURIComponent(
            data.email,
          )}/`)
          if (resp.ok) {
            const company = await resp.json()
            companyState.setCompany({
              email: company.email,
              companyName: company.company_name ?? '',
              companyInformation: company.company_information ?? '',
            })
          } else {
            companyState.setCompany(undefined)
          }
        } catch {
          companyState.setCompany(undefined)
        }
      } else {
        companyState.setCompany(undefined)
      }

      if (data.account_type === 'candidate') {
        try {
          const resp = await fetch(`/api/candidate/${encodeURIComponent(
            data.email,
          )}/`)
          if (resp.ok) {
            const c = await resp.json()
            const skills = Array.isArray(c.skills)
              ? c.skills
              : typeof c.skills === 'string'
              ? c.skills
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : []

            candidateState.setCandidate({
              email: c.email,
              fullName: c.full_name ?? '',
              phoneNumber: c.phone_number ?? '',
              university: c.university ?? '',
              degreeName: c.degree_name ?? '',
              yearsOfExperience: Number(c.years_of_experience) || 0,
              skills,
              preferredWorkingMode: c.preferred_working_mode ?? '',
              preferredLocation: c.preferred_location ?? '',
            })
          } else {
            candidateState.setCandidate(undefined)
          }
        } catch {
          candidateState.setCandidate(undefined)
        }
      } else {
        candidateState.setCandidate(undefined)
      }

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
    <AuthCard
      title="Login"
      onSubmit={handleSubmit}
      submitText="Login"
      error={error}
      containerClass="login-container"
      cardClass="login-card"
      footer={(
        <>
          <span>Sign up as </span>
          <button type="button" className="login-footer-link" onClick={() => navigate('/create-employer')}>
            company
          </button>
          <span> | </span>
          <button type="button" className="login-footer-link" onClick={() => navigate('/create-candidate')}>
            candidate
          </button>
        </>
      )}
    >
      <FormField id="email" label="Email" as="input" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <FormField id="password" label="Password">
        <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
      </FormField>
    </AuthCard>
  )
}

export default LoginForm
