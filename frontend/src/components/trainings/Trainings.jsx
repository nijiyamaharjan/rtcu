import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Trainings = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      const response = await fetch("http://localhost:5000/training/all");
      const json = await response.json();
      if (response.ok) {
        setTrainings(json);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div id="trainings" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Trainings</p>
        <Link
          to="/add-training"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Training
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainings.map((training) => (
          <div
            key={training.trainingid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {training.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Training ID:</span> {training.trainingid}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Start Date:</span> {training.startdate}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">End Date:</span> {training.enddate}
            </p>
            <Link
              to={`/training/${training.trainingid}`}
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
