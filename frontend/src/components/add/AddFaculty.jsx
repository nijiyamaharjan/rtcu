import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddFaculty = () => {
    const navigate = useNavigate(); 
  const [faculty, setFaculty] = useState({
    facultyID: '',
    name: '',
    role: '',
    expertise: '',
    contactInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty({
      ...faculty,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/faculty/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faculty)
    });

    if (response.ok) {
      alert('Faculty added successfully');
      setFaculty({
        facultyID: '',
        name: '',
        role: '',
        expertise: '',
        contactInfo: ''
      });
      navigate("/")
    } else {
      alert('Error adding faculty');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Faculty</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="facultyID" className="block text-sm font-medium text-gray-700">Faculty ID</label>
          <input
            type="text"
            id="facultyID"
            name="facultyID"
            value={faculty.facultyID}
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
            value={faculty.name}
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
            value={faculty.role}
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
            value={faculty.expertise}
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
            value={faculty.contactInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Add Faculty
          </button>
        </div>
      </form>
    </div>
  );
};