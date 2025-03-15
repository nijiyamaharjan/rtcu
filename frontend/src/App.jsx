import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { ProjectDetail } from './components/details/ProjectDetail';
import { AddFaculty } from './components/add/AddFaculty';
import { AddStudent } from './components/add/AddStudent';
import { AddOrganization } from './components/add/AddOrganization';
import { AddExpert } from './components/add/AddExpert';
import { AddProject } from './components/add/AddProject';
import { AddTraining } from './components/add/AddTraining';
import { TrainingDetail } from './components/details/TrainingDetail';
import { FacultyDetail } from './components/details/FacultyDetail';
import { ExpertDetail } from './components/details/ExpertDetail';
import { StudentDetail } from './components/details/StudentDetail';
import { OrganizationDetail } from './components/details/OrganizationDetail';
import LoginPage from './components/Login';
import { Projects } from './components/projects/Projects';
import { Trainings } from './components/trainings/Trainings';
import { Team } from './components/team/Team';
import tuLogo from './assets/tu-logo.png';

// Routes array
const routes = [
  { path: '/', element: <Home /> },
  { path: '/project/:id', element: <ProjectDetail /> },
  { path: '/training/:id', element: <TrainingDetail /> },
  { path: '/faculty/:id', element: <FacultyDetail /> },
  { path: '/expert/:id', element: <ExpertDetail /> },
  { path: '/student/:id', element: <StudentDetail /> },
  { path: '/organization/:id', element: <OrganizationDetail /> },
  { path: '/add-faculty', element: <AddFaculty /> },
  { path: '/add-expert', element: <AddExpert /> },
  { path: '/add-student', element: <AddStudent /> },
  { path: '/add-organization', element: <AddOrganization /> },
  { path: '/add-project', element: <AddProject /> },
  { path: '/add-training', element: <AddTraining /> },
  { path: '/login', element: <LoginPage/> },
  { path: '/projects', element: <Projects/> },
  { path: '/trainings', element: <Trainings/> },
  { path: '/team', element: <Team/> },
];

function AppContent() {
  const location = useLocation();

  // Define paths where the Navbar should be hidden
  const hideNavbarRoutes = ['/login'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* RTCU Header - This remains on all pages */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <header className="bg-indigo-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Logo/Emblem */}
            <div className="w-20 h-20 mx-auto mb-4">
              {/* This is a placeholder for your logo */}
                        <img 
                          src={tuLogo}
                          alt="TU Logo"
                          className="mx-auto mb-6 h-20 w-auto"
                        />
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl font-bold mb-2">
              RTCU at IOE, Tribhuvan University
            </h1>
            
            {/* Subtitle */}
            <p className="text-blue-100">
              Research, Training, and Consultancy Unit
            </p>
          </div>
        </header>
      )}

      {/* Navigation Bar - Below the header */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}