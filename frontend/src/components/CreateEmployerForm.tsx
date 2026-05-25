import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserState } from '../providers/UserProvider'
import { useCompanyState } from '../providers/CompanyProvider'
import { useUserRedirect, createConfirmPasswordHandler } from '../utils/forms'
import AuthCard from './common/AuthCard'
import PasswordField from './common/PasswordField'
import FormField from './common/FormField'

function CreateEmployerForm() {
  const navigate = useNavigate()
  const userState = useUserState()
  const companyState = useCompanyState()
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [companyInformation, setCompanyInformation] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useUserRedirect(navigate, userState)

  const handleConfirmPasswordChange = createConfirmPasswordHandler(
    setConfirmPassword,
    confirmPasswordRef,
  )

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          account_type: 'company',
        }),
      })

      const accountData = await accountResponse.json().catch(() => ({}))

      if (!accountResponse.ok) {
        setError(accountData.error ?? 'Unable to create account')
        return
      }

      const companyResponse = await fetch('/api/register-company/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: companyName,
          email,
          company_information: companyInformation,
        }),
      })

      const companyData = await companyResponse.json().catch(() => ({}))

      if (!companyResponse.ok) {
        setError(companyData.error ?? 'Unable to create company profile')
        return
      }

      userState.setUser({
        email: companyData.email ?? accountData.email ?? email,
        accountType: companyData.account_type ?? accountData.account_type ?? 'company',
      })
      companyState.setCompany({
        email: companyData.email ?? accountData.email ?? email,
        companyName,
        companyInformation,
      })
      navigate('/search-candidates')
    } catch {
      setError('Unable to reach the registration service')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      containerClass="login-container"
      cardClass="login-card employer-card"
      title="Create a company account"
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
      <FormField id="company-name" label="Company name" as="input" type="text" placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />

      <FormField id="email" label="Email" as="input" type="email" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <FormField id="company-information" label="Company information" as="textarea" placeholder="Company information" value={companyInformation} onChange={(e) => setCompanyInformation(e.target.value)} rows={4} required />

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">Confirm password</label>
        <PasswordField ref={confirmPasswordRef} id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm password" required />
      </div>
    </AuthCard>
  )
}

export default CreateEmployerForm
