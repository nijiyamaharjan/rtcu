import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-10 py-4">
      <ul className="flex gap-8 text-gray-700">
        <li className="hover:text-blue-500">
          <RouterLink to="/" className="font-medium">
            Home
          </RouterLink>
        </li>
        <li className="hover:text-blue-500">
          <Link 
            to="projects" 
            smooth={true} 
            duration={500} 
            className="cursor-pointer font-medium"
          >
            Projects
          </Link>
        </li>
        <li className="hover:text-blue-500">
          <Link 
            to="trainings" 
            smooth={true} 
            duration={500} 
            className="cursor-pointer font-medium"
          >
            Trainings
          </Link>
        </li>
        <li className="hover:text-blue-500">
          <Link 
            to="team" 
            smooth={true} 
            duration={500} 
            className="cursor-pointer font-medium"
          >
            Team
          </Link>
        </li>
      </ul>
    </nav>
  );
};
