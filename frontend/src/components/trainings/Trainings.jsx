import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuth();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("http://localhost:5000/training/all");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch trainings`);
        }
        const json = await response.json();
        setTrainings(json);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Trainings</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Trainings</h1>
        {user && (
          <Link
            to="/add-training"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Training
          </Link>
        )}
      </div>

      {trainings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No trainings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <div
              key={training.trainingid}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{training.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Training ID:</span> {training.trainingid}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Start Date:</span> {formatDate(training.startdate)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">End Date:</span> {formatDate(training.enddate)}
              </p>
              <Link
                to={`/training/${training.trainingid}`}
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
