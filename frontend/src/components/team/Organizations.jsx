import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await fetch('http://localhost:5000/organization/all');
      const json = await response.json();
      if (response.ok) {
        setOrganizations(json);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div id="organization" className="px-4">
      <p className="text-2xl font-semibold py-4">Organization</p>
      <Link to={"/add-organization"} className="text-blue-500">Add Organization</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((organization) => (
          <div
            key={organization.organizationid}
            className="p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-2">{organization.name}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Organization ID:</span> {organization.organizationid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Contact Info:</span> {organization.contactInfo}
            </p>
            <Link
          to={`/organization/${organization.organizationid}`}
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
