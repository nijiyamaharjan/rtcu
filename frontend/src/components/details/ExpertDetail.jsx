import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const expertiseOptions = [
  'Web Development',
  'Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Blockchain',
  'DevOps',
  'Cloud Computing',
  'Game Development',
  'UI/UX Design',
  'Mobile Development',
];

export const ExpertDetail = () => {
  const { id } = useParams(); // Get the expertID from the route parameter
  const navigate = useNavigate(); // For navigation after update or delete
  const [expert, setExpert] = useState(null);

  // Handle input changes for update form
  const [updatedExpert, setUpdatedExpert] = useState({
    name: '',
    role: '',
    expertise: '',
    contactInfo: '',
  });
  const user = useAuth()

  useEffect(() => {
    // Fetch the expert data based on expertID
    const fetchExpertData = async () => {
      const response = await fetch(`http://localhost:5000/expert/${id}`);
      if (response.ok) {
        const data = await response.json();
        setExpert(data);
        setUpdatedExpert({
          name: data.name,
          role: data.role,
          expertise: data.expertise,
          contactInfo: data.contactInfo,
        });
      } else {
        console.error('Error fetching expert data');
      }
    };

    fetchExpertData();
  }, [id]); // Fetch data when the id changes

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedExpert({
      ...updatedExpert,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/expert/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExpert),
    });

    if (response.ok) {
      alert('Expert updated successfully');
      setExpert({
        ...expert,
        ...updatedExpert,
      });
    } else {
      alert('Error updating expert');
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/expert/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Expert deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } else {
      alert('Error deleting expert');
    }
  };

  if (!expert) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{expert.name}</h2>

      {/* Expert Details */}
      <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
        <span>
          <strong>Expert ID:</strong> {expert.expertID}
        </span>
        <span>
          <strong>Name:</strong> {expert.name}
        </span>
        <span>
          <strong>Role:</strong> {expert.role}
        </span>
        <span>
          <strong>Expertise:</strong> {expert.expertise}
        </span>
        <span>
          <strong>Contact Info:</strong> {expert.contactInfo}
        </span>
      </div>

{user && (
  <>
  {/* Update Form */}
  <h3 className="text-xl font-semibold mt-8 mb-4">Update Expert</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedExpert.name}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={updatedExpert.role}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
            Expertise
          </label>
          <select
            id="expertise"
            name="expertise"
            value={updatedExpert.expertise}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>
              Select expertise
            </option>
            {expertiseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={updatedExpert.contactInfo}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Update Expert
          </button>
        </div>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Expert
        </button>
      </div>
  </>
)}
      
    </div>
  );
};
