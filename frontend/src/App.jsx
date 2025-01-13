import { Home } from './components/Home';
import { Navbar } from './components/Navbar';
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
  { path: '/add-training', element: <AddTraining /> }
];

import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
