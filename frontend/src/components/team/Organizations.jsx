import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await fetch("http://localhost:5000/organization/all");
      const json = await response.json();
      if (response.ok) {
        setOrganizations(json);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div id="organization" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Organizations</p>
        <Link
          to="/add-organization"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Organization
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {organizations.map((organization) => (
          <div
            key={organization.organizationid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {organization.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Organization ID:</span>{" "}
              {organization.organizationid}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Contact Info:</span>{" "}
              {organization.contactInfo}
            </p>
            <Link
              to={`/organization/${organization.organizationid}`}
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
