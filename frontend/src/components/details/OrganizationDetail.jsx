import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from './../../hooks/useAuth';

export const OrganizationDetail = () => {
  const { id } = useParams(); // Get the organizationID from the route parameter
  const navigate = useNavigate(); // For navigation after update or delete
  const [organization, setOrganization] = useState(null);
  const user = useAuth()

  // Handle input changes for update form
  const [updatedOrganization, setUpdatedOrganization] = useState({
    name: '',
    contactInfo: ''
  });

  useEffect(() => {
    // Fetch the organization data based on organizationID
    const fetchOrganizationData = async () => {
      const response = await fetch(`http://localhost:5000/organization/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
        setUpdatedOrganization({
          name: data.name,
          contactInfo: data.contactInfo
        });
      } else {
        console.error("Error fetching organization data");
      }
    };

    fetchOrganizationData();
  }, [id]); // Fetch data when the id changes

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrganization({
      ...updatedOrganization,
      [name]: value
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/organization/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedOrganization)
    });

    if (response.ok) {
      alert('Organization updated successfully');
      setOrganization({
        ...organization,
        ...updatedOrganization
      });
    } else {
      alert('Error updating organization');
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/organization/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Organization deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } else {
      alert('Error deleting organization');
    }
  };

  if (!organization) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{organization.name}</h2>

      {/* Organization Details */}
      <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
        <span>
          <strong>Organization ID:</strong> {organization.organizationid}
        </span>
        <span>
          <strong>Name:</strong> {organization.name}
        </span>
        <span>
          <strong>Contact Info:</strong> {organization.contactinfo}
        </span>
      </div>

{user && (
  <>
   {/* Update Form */}
   <h3 className="text-xl font-semibold mt-8 mb-4">Update Organization</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedOrganization.name}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={updatedOrganization.contactInfo}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Update Organization
          </button>
        </div>
      </form>
      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Organization
        </button>
      </div>
  </>
)}
     

      
    </div>
  );
};
