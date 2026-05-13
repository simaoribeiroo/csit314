import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import { Layout } from './pages/Layout'
import { UserProvider } from './providers/UserProvider'
import { CreateCandidatePage } from './pages/CreateCandidatePage';
import { CreateEmployerPage } from './pages/CreateEmployerPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchCandidatesPage } from './pages/SearchCandidatesPage';
import { SearchJobsPage } from './pages/SearchJobsPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CandidateProfilePage from './pages/CandidateProfilePage';

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				index: true,
				element: <Navigate to="/login" replace/>,
			},
			{
				path: "/login",
				Component: LoginPage,
			},
			{
				path:"/profile",
				Component:ProfilePage
			},
			{
				path:"/create-candidate",
				Component:CreateCandidatePage
			},
			{
				path:"/create-employer",
				Component:CreateEmployerPage
			},
			{
				path:"/search-jobs",
				Component:SearchJobsPage
			},
			{
				path:"/search-candidates",
				Component:SearchCandidatesPage
			},
			{
				path:"/company-profile",
				Component:CompanyProfilePage
			},
			{
				path:"/candidate-profile",
				Component:CandidateProfilePage
			}
		]
	}
]);

function App() {

	return (
		<UserProvider>
			<RouterProvider router={router} />
		</UserProvider>
	)
}

export default App
