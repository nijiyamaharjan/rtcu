import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Faculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const response = await fetch("http://localhost:5000/faculty/all");
      const json = await response.json();
      if (response.ok) {
        setFaculty(json);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div id="faculty" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Faculty</p>
        <Link
          to="/add-faculty"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Faculty
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {faculty.map((person) => (
          <div
            key={person.facultyid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {person.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Faculty ID:</span> {person.facultyid}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Role:</span> {person.role}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Expertise:</span> {person.expertise}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Contact Info:</span> {person.contactInfo}
            </p>
            <Link
              to={`/faculty/${person.facultyid}`}
              className="text-blue-500 font-medium hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
