import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import { Layout } from './pages/Layout'
import { UserProvider } from './providers/UserProvider'
import { CompanyProvider } from './providers/CompanyProvider'
import { CandidateProvider } from './providers/CandidateProvider'
import { CreateCandidatePage } from './pages/CreateCandidatePage';
import { CreateEmployerPage } from './pages/CreateEmployerPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchCandidatesPage } from './pages/SearchCandidatesPage';
import { SearchJobsPage } from './pages/SearchJobsPage';

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
		]
	}
]);

function App() {

	return (
		<UserProvider>
			<CompanyProvider>
				<CandidateProvider>
					<RouterProvider router={router} />
				</CandidateProvider>
			</CompanyProvider>
		</UserProvider>
	)
}

export default App
