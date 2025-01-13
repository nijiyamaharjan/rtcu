import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddStudent = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    studentID: '',
    name: '',
    expertise: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({
      ...student,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/student/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (response.ok) {
      alert('Student added successfully');
      setStudent({
        studentID: '',
        name: '',
        expertise: '',
        contactInfo: '',
      });
      navigate('/'); // Navigate to the home page after successful form submission
    } else {
      alert('Error adding student');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="studentID" className="block text-sm font-medium text-gray-700">Student ID</label>
          <input
            type="text"
            id="studentID"
            name="studentID"
            value={student.studentID}
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
            value={student.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            value={student.expertise}
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
            value={student.contactInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};
