import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Banner from './components/Banner'
import CreateCandidatePage from './pages/CreateCandidatePage'
import CreateEmployerPage from './pages/CreateEmployerPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SearchCandidatesPage from './pages/SearchCandidatesPage'
import SearchJobsPage from './pages/SearchJobsPage'

function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Banner />
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/search-jobs" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create-candidate" element={<CreateCandidatePage />} />
          <Route path="create-employer" element={<CreateEmployerPage />} />
          <Route path="search-jobs" element={<SearchJobsPage />} />
          <Route path="search-candidates" element={<SearchCandidatesPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
