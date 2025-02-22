import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home,
  ProjectorIcon,
  Users,
  GraduationCap,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: ProjectorIcon, label: 'Projects' },
    { path: '/trainings', icon: GraduationCap, label: 'Trainings' },
    { path: '/team', icon: Users, label: 'Team' },
  ];

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-indigo-900 text-white h-screen transition-all duration-300 flex flex-col relative`}
    >
      <button
        className={`absolute -right-3 top-6 bg-indigo-600 rounded-full p-1.5 
          hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 
          focus:ring-offset-2 transition-all duration-300 shadow-lg`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-white" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white" />
        )}
      </button>

      <nav className="flex-grow mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <RouterLink
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg 
                  transition-all duration-200 
                  hover:bg-indigo-800/50 
                  group
                  ${window.location.pathname === item.path ? 'bg-indigo-800/70' : ''}`}
              >
                <item.icon className={`w-5 h-5 text-blue-200 group-hover:text-white 
                  transition-all duration-200
                  ${window.location.pathname === item.path ? 'text-white' : ''}`} 
                />
                {isOpen && (
                  <span className={`ml-4 font-medium text-sm text-blue-100 group-hover:text-white
                    transition-all duration-200
                    ${window.location.pathname === item.path ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                )}
              </RouterLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-indigo-800">
        {user ? (
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 rounded-lg
              transition-all duration-200
              hover:bg-indigo-800/50 text-blue-200 hover:text-white
              group`}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-4 font-medium text-sm">Logout</span>}
          </button>
        ) : (
          <RouterLink
            to="/login"
            className={`w-full flex items-center px-4 py-3 rounded-lg
              transition-all duration-200
              hover:bg-indigo-800/50 text-blue-200 hover:text-white
              group`}
          >
            <LogIn className="w-5 h-5" />
            {isOpen && <span className="ml-4 font-medium text-sm">Login</span>}
          </RouterLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;