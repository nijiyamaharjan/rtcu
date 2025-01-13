import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const FacultyDetail = () => {
  const { id } = useParams(); // Get the facultyID from the route parameter
  const navigate = useNavigate(); // For navigation after update or delete
  const [faculty, setFaculty] = useState(null);

  // Handle input changes for update form
  const [updatedFaculty, setUpdatedFaculty] = useState({
    name: '',
    role: '',
    expertise: '',
    contactInfo: ''
  });

  useEffect(() => {
    // Fetch the faculty data based on facultyID
    const fetchFacultyData = async () => {
      const response = await fetch(`http://localhost:5000/faculty/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
        setUpdatedFaculty({
          name: data.name,
          role: data.role,
          expertise: data.expertise,
          contactInfo: data.contactInfo
        });
      } else {
        console.error("Error fetching faculty data");
      }
    };

    fetchFacultyData();
  }, [id]); // Fetch data when the id changes

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFaculty({
      ...updatedFaculty,
      [name]: value
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/faculty/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFaculty)
    });

    if (response.ok) {
      alert('Faculty updated successfully');
      setFaculty({
        ...faculty,
        ...updatedFaculty
      });
    } else {
      alert('Error updating faculty');
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/faculty/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Faculty deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } else {
      alert('Error deleting faculty');
    }
  };

  if (!faculty) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{faculty.name}</h2>

      {/* Faculty Details */}
      <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
        <span>
          <strong>Faculty ID:</strong> {faculty.facultyid}
        </span>
        <span>
          <strong>Name:</strong> {faculty.name}
        </span>
        <span>
          <strong>Role:</strong> {faculty.role}
        </span>
        <span>
          <strong>Expertise:</strong> {faculty.expertise}
        </span>
        <span>
          <strong>Contact Info:</strong> {faculty.contactinfo}
        </span>
      </div>

      {/* Update Form */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Update Faculty</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedFaculty.name}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={updatedFaculty.role}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            value={updatedFaculty.expertise}
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
            value={updatedFaculty.contactInfo}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Update Faculty
          </button>
        </div>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Faculty
        </button>
      </div>
    </div>
  );
};
