import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Experts = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const response = await fetch("http://localhost:5000/expert/all");
      const json = await response.json();
      if (response.ok) {
        setExperts(json);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div id="experts" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Experts</p>
        <Link
          to="/add-expert"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Expert
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.map((expert) => (
          <div
            key={expert.expertid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {expert.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Expert ID:</span> {expert.expertid}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Role:</span> {expert.role}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Expertise:</span> {expert.expertise}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Contact Info:</span> {expert.contactInfo}
            </p>
            <Link
              to={`/expert/${expert.expertid}`}
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
