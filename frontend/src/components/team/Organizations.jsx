import { useEffect, useState } from "react";

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
    <div>
      <p className="text-2xl py-4">Organization</p>
      <ul className="flex">
        {organizations.map((organization) => (
          <li key={organization.organizationid} className="py-2">
            <p>Organization ID : {organization.organizationid}</p>
            <p>Name : {organization.name}</p>
            <p>Contact Info : {organization.contactInfo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
