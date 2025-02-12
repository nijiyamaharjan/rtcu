import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { FaHome, FaProjectDiagram, FaUserFriends, FaChalkboardTeacher } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout'
import { useNavigate } from 'react-router-dom';
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = useAuth()
  const logout = useLogout(); // This now directly gives the logout function
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout(); // Clear token or session
    navigate('/login')
  };

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-800 text-white h-screen transition-all duration-300 flex flex-col`}
    >
      <button
        className="p-4 text-gray-400 hover:text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? '<' : '>'}
      </button>
      <ul className="mt-4 space-y-4 flex-grow">
        <li className="hover:text-blue-300">
          <RouterLink
            to="/"
            className="flex items-center px-4 py-2 font-medium space-x-4"
          >
            <FaHome className="text-xl" />
            {isOpen && <span>Home</span>}
          </RouterLink>
        </li>
        <li className="hover:text-blue-300">
          <RouterLink
            to="/projects"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaProjectDiagram className="text-xl" />
            {isOpen && <span>Projects</span>}
          </RouterLink>
        </li>
        <li className="hover:text-blue-300">
          <RouterLink
            to="/trainings"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaChalkboardTeacher className="text-xl" />
            {isOpen && <span>Trainings</span>}
          </RouterLink>
        </li>
        <li className="hover:text-blue-300">
          <RouterLink
            to="/team"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaUserFriends className="text-xl" />
            {isOpen && <span>Team</span>}
          </RouterLink>
        </li>
        {user ? (
          <li className="hover:text-blue-300">
            <a
              onClick={handleLogout} // Trigger the logout on click
              className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
            >
<RouterLink
            to="/logout"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            {isOpen && <span>Logout</span>}
          </RouterLink>
            </a>
          
        </li>
        ) : (
          <li className="hover:text-blue-300">
          <RouterLink
            to="/login"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            {isOpen && <span>Login</span>}
          </RouterLink>
        </li>
        )}       
      </ul>
    </div>
  );
};
