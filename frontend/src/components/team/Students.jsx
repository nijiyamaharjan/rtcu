import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:5000/student/all');
      const json = await response.json();
      if (response.ok) {
        setStudents(json);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div id="students" className="px-4">
      <p className="text-2xl font-semibold py-4">Students</p>
      <Link to={"/add-student"} className="text-blue-500">Add Student</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.studentid}
            className="p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-2">{student.name}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Student ID:</span> {student.studentid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Expertise:</span> {student.expertise}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Contact Info:</span> {student.contactInfo}
            </p>
            <Link
          to={`/student/${student.studentid}`}
          className="text-blue-500 hover:underline"
        >
          Details
        </Link>
          </div>
        ))}

      </div>
    </div>

  );
};
