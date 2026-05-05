import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateCandidatePage from './pages/CreateCandidatePage'
import CreateEmployerPage from './pages/CreateEmployerPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SearchCandidatesPage from './pages/SearchCandidatesPage'
import SearchJobsPage from './pages/SearchJobsPage'

type NavigationItem = {
  label: string
  to: string
}

const navigationItems: NavigationItem[] = [
  { label: 'Login', to: '/login' },
  { label: 'Profile', to: '/profile' },
  { label: 'Create Candidate', to: '/create-candidate' },
  { label: 'Create Employer', to: '/create-employer' },
  { label: 'Search Jobs', to: '/search-jobs' },
  { label: 'Search Candidates', to: '/search-candidates' },
]

function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">SM</span>
          <div className="brand-copy">
            <strong>SportsMeet</strong>
            <span>Recruiting workspace</span>
          </div>
        </div>

        <nav className="nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="create-candidate" element={<CreateCandidatePage />} />
        <Route path="create-employer" element={<CreateEmployerPage />} />
        <Route path="search-jobs" element={<SearchJobsPage />} />
        <Route path="search-candidates" element={<SearchCandidatesPage />} />
      </Route>
    </Routes>
  )
}

export default App
