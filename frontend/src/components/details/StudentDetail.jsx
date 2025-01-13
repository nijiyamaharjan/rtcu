import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const StudentDetail = () => {
  const { id } = useParams(); // Get the studentID from the route parameter
  const navigate = useNavigate(); // To navigate after delete or update
  const [student, setStudent] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState({
    name: '',
    expertise: '',
    contactInfo: '',
  });

  useEffect(() => {
    // Fetch the student data based on studentID
    const fetchStudentData = async () => {
      const response = await fetch(`http://localhost:5000/student/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setUpdatedStudent({
          name: data.name,
          expertise: data.expertise,
          contactInfo: data.contactInfo,
        });
      } else {
        console.error("Error fetching student data");
      }
    };

    fetchStudentData();
  }, [id]); // Fetch data when the id changes

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/student/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    });

    if (response.ok) {
      alert('Student updated successfully');
      setStudent({ ...student, ...updatedStudent });
    } else {
      alert('Error updating student');
    }
  };

  // Handle delete student
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/student/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Student deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } else {
      alert('Error deleting student');
    }
  };

  if (!student) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{student.name}</h2>
      <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
        <span>
          <strong>Student ID:</strong> {student.studentID}
        </span>
        <span>
          <strong>Name:</strong> {student.name}
        </span>
        <span>
          <strong>Expertise:</strong> {student.expertise}
        </span>
        <span>
          <strong>Contact Info:</strong> {student.contactInfo}
        </span>
      </div>

      {/* Update Form */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Update Student</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedStudent.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
            Expertise
          </label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            value={updatedStudent.expertise}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={updatedStudent.contactInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Update Student
          </button>
        </div>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Student
        </button>
      </div>
    </div>
  );
};
