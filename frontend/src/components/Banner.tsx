import { useNavigate } from 'react-router-dom'
import { FC, useEffect, useState } from "react";
import { useUserState } from '../providers/UserProvider';
interface IBannerProps { };

export const Banner: FC<IBannerProps> = (_) => {
  let navigate = useNavigate();
  const userState = useUserState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(userState.getUser() != undefined);

  function onLogin() {
    setIsLoggedIn(true);
  }

  function onLogout() {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    window.addEventListener("loggedIn", onLogin);
    window.addEventListener("loggedOut", onLogout);
    return () => {
      window.removeEventListener("loggedIn", onLogin);
      window.removeEventListener("loggedOut", onLogout);
    }
  }, [])

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-brand">
          <span className="banner-title">Job</span>
          <span className="banner-title accent">Match</span>
        </div>
        {isLoggedIn ?
          <button
            className="banner-user-btn"
            onClick={() => navigate('/profile')}
            aria-label="User menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          : ""}
      </div>
    </div>
  )
}
