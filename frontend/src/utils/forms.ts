import { useEffect } from 'react'
import type React from 'react'

export function useUserRedirect(
  navigate: (to: string, opts?: { replace?: boolean }) => void,
  userState: { getUser: () => { accountType?: string } | undefined },
) {
  useEffect(() => {
    const currentUser = userState.getUser()
    if (!currentUser) {
      return
    }

    if (currentUser.accountType === 'candidate') {
      navigate('/search-jobs', { replace: true })
      return
    }

    if (currentUser.accountType === 'company') {
      navigate('/search-candidates', { replace: true })
      return
    }

    navigate('/profile', { replace: true })
  }, [navigate, userState])
}

export function createConfirmPasswordHandler(
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>,
  // Accept either RefObject or MutableRefObject (both have a `current` field)
  confirmPasswordRef: { current: HTMLInputElement | null } | null,
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (confirmPasswordRef && confirmPasswordRef.current) {
      confirmPasswordRef.current.setCustomValidity('')
    }
  }
}
