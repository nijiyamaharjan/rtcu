import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home,
  ProjectorIcon as Projects,
  Users,
  GraduationCap as Trainings,
  LogOut,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: Projects, label: 'Projects' },
    { path: '/trainings', icon: Trainings, label: 'Trainings' },
    { path: '/team', icon: Users, label: 'Team' },
  ];

  const isActive = (path) => window.location.pathname === path;

  return (
    <>
      {/* Desktop navbar */}
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex justify-center h-14">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {menuItems.map((item) => (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive(item.path) ? 'bg-indigo-800 text-white' : 'text-blue-100 hover:bg-indigo-800 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </RouterLink>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium
                    text-blue-100 hover:bg-indigo-800 hover:text-white ml-4"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              ) : (
                <RouterLink
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium
                    text-blue-100 hover:bg-indigo-800 hover:text-white ml-4"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </RouterLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-indigo-800"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive(item.path) ? 'bg-indigo-800 text-white' : 'text-blue-100 hover:bg-indigo-800 hover:text-white'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </RouterLink>
              ))}
              
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                    text-blue-100 hover:bg-indigo-800 hover:text-white"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              ) : (
                <RouterLink
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium
                    text-blue-100 hover:bg-indigo-800 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </RouterLink>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;