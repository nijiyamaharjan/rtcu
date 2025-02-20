import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuth()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/student/all");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const json = await response.json();
        setStudents(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Students</h3>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
        {user && (
          <Link
          to="/add-student"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Student
        </Link>
        )}
        
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No students found. Add some to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div
              key={student.studentid}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{student.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Student ID:</span> {student.studentid}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Expertise:</span> {student.expertisename}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Contact Info:</span> {student.contactinfo}
              </p>
              <Link
                to={`/student/${student.studentid}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
