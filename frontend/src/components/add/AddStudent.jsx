import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'AI Engineer',
  'Data Analyst',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Game Designer',
  'QA Engineer',
  'Product Manager',
];

export const AddStudent = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    studentID: '',
    name: '',
    expertise: '',
    role: '',
    contactInfo: '',
  });

  // Updates the form fields when any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({
      ...student,
      [name]: value,
    });
  };

  // Handles form submission
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
        role: '',
        contactInfo: '',
      });
      navigate('/');
    } else {
      alert('Error adding student');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student ID */}
        <div>
          <label htmlFor="studentID" className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
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

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
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

        {/* Expertise Dropdown */}
        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
            Expertise
          </label>
          <select
            id="expertise"
            name="expertise"
            value={student.expertise} // Updates when an option is clicked
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            style={{ maxHeight: '100px', overflowY: 'auto' }} // Limits height and adds scrolling
          >
            <option value="" disabled>
              Select Expertise
            </option>
            {expertiseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={student.role} // Updates when an option is clicked
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            style={{ maxHeight: '100px', overflowY: 'auto' }} // Limits height and adds scrolling
          >
            <option value="" disabled>
              Select Role
            </option>
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Info */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={student.contactInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};
