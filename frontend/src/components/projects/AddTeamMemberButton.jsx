// AddTeamMemberButton.jsx
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const AddTeamMemberButton = ({ showAddMenu, setShowAddMenu }) => {
    return (
        <div className="relative inline-block mb-4">
            <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="inline-flex items-center rounded-md bg-blue-600 ml-4 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-1"
            >
                Register New Team Member
            </button>
            
            {showAddMenu && (
                <div className="absolute left-5 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                            to="/add-student"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setShowAddMenu(false)}
                        >
                            Register as Student
                        </Link>
                        <Link
                            to="/add-faculty"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setShowAddMenu(false)}
                        >
                            Register as Faculty
                        </Link>
                        <Link
                            to="/add-expert"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setShowAddMenu(false)}
                        >
                            Register as Expert
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTeamMemberButton;