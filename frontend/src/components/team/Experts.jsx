import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Experts = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const response = await fetch('http://localhost:5000/expert/all');
      const json = await response.json();
      if (response.ok) {
        setExperts(json);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div id="experts" className="px-4">
      <p className="text-2xl font-semibold py-4">Experts</p>
      <Link to={"/add-expert"} className="text-blue-500">Add Expert</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <div
            key={expert.expertid}
            className="p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-2">{expert.name}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Expert ID:</span> {expert.expertid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Role:</span> {expert.role}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Expertise:</span> {expert.expertise}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Contact Info:</span> {expert.contactInfo}
            </p>
            <Link
          to={`/expert/${expert.expertid}`}
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
