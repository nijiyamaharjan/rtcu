import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { FaHome, FaProjectDiagram, FaUserFriends, FaChalkboardTeacher } from 'react-icons/fa';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
          <Link
            to="projects"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaProjectDiagram className="text-xl" />
            {isOpen && <span>Projects</span>}
          </Link>
        </li>
        <li className="hover:text-blue-300">
          <Link
            to="trainings"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaChalkboardTeacher className="text-xl" />
            {isOpen && <span>Trainings</span>}
          </Link>
        </li>
        <li className="hover:text-blue-300">
          <Link
            to="team"
            smooth={true}
            duration={500}
            className="flex items-center px-4 py-2 cursor-pointer font-medium space-x-4"
          >
            <FaUserFriends className="text-xl" />
            {isOpen && <span>Team</span>}
          </Link>
        </li>
      </ul>
      <div className="mt-auto text-center pb-4">
        <span className="text-sm text-gray-400">
          {isOpen ? '© 2025 Your App' : '© 25'}
        </span>
      </div>
    </div>
  );
};
