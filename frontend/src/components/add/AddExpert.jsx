import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddExpert = () => {
    const navigate = useNavigate();
  const [expert, setExpert] = useState({
    expertID: '',
    name: '',
    role: '',
    expertise: '',
    contactInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpert({
      ...expert,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/expert/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expert)
    });

    if (response.ok) {
      alert('Expert added successfully');
      setExpert({
        expertID: '',
        name: '',
        role: '',
        expertise: '',
        contactInfo: ''
      });
      navigate("/")
    } else {
      alert('Error adding expert');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Expert</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="expertID" className="block text-sm font-medium text-gray-700">Expert ID</label>
          <input
            type="text"
            id="expertID"
            name="expertID"
            value={expert.expertID}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={expert.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={expert.role}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            value={expert.expertise}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={expert.contactInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Add Expert
          </button>
        </div>
      </form>
    </div>
  );
};