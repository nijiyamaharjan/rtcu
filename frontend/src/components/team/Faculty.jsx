import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuth()

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch("http://localhost:5000/faculty/all");
        if (!response.ok) {
          throw new Error("Failed to fetch faculty members");
        }
        const json = await response.json();
        setFaculty(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
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
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Faculty</h3>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty</h1>
        {user && (
          <Link
          to="/add-faculty"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Faculty
        </Link>
        )}
        
      </div>

      {faculty.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No faculty members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((person) => (
            <div
              key={person.facultyid}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{person.name}</h2>
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
