import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("http://localhost:5000/student/all");
      const json = await response.json();
      if (response.ok) {
        setStudents(json);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div id="students" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Students</p>
        <Link
          to="/add-student"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Student
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.map((student) => (
          <div
            key={student.studentid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {student.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Student ID:</span> {student.studentid}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Expertise:</span> {student.expertise}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Contact Info:</span> {student.contactInfo}
            </p>
            <Link
              to={`/student/${student.studentid}`}
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
