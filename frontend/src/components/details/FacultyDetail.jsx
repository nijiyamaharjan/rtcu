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

export const FacultyDetail = () => {
  const { id } = useParams(); // Get the facultyID from the route parameter
  const navigate = useNavigate(); // For navigation after update or delete
  const [faculty, setFaculty] = useState(null);
  const user = useAuth()

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
      try {
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
      } catch (error) {
        console.error("Network error: ", error);
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

    try {
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
    } catch (error) {
      console.error("Update error: ", error);
      alert('Error updating faculty');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/faculty/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Faculty deleted successfully');
        navigate('/'); // Redirect to home page after deletion
      } else {
        alert('Error deleting faculty');
      }
    } catch (error) {
      console.error("Delete error: ", error);
      alert('Error deleting faculty');
    }
  };

  if (!faculty) {
    return <div className="text-center text-gray-500">Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{faculty.name}</h2>

      {/* Faculty Details */}
      <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-600">
        <span><strong>Faculty ID:</strong> {faculty.facultyid}</span>
        <span><strong>Name:</strong> {faculty.name}</span>
        <span><strong>Role:</strong> {faculty.role}</span>
        <span><strong>Expertise:</strong> {faculty.expertise}</span>
        <span><strong>Contact Info:</strong> {faculty.contactInfo}</span>
      </div>

{user && (
  <>
  {/* Update Form */}
  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Update Faculty</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedFaculty.name}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
          <select
            id="expertise"
            name="expertise"
            value={updatedFaculty.expertise}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          >
            <option value="" disabled>Select expertise</option>
            {expertiseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={updatedFaculty.contactInfo}
            onChange={handleUpdateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update Faculty
          </button>
        </div>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Faculty
        </button>
      </div>
  </>
)}
      
    </div>
  );
};
