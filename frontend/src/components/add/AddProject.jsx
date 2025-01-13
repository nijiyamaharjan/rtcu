import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddProject = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [project, setProject] = useState({
    projectID: '',
    title: '',
    description: '',
    type: 'research',
    startDate: '',
    endDate: '',
    status: 'ongoing',
    budget: '',
    fundingOrgID: '',
    outsourcingOrgID: ''
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await fetch('http://localhost:5000/organization/all');
      const data = await response.json();
      setOrganizations(data);
    };

    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/project/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });

    if (response.ok) {
      alert('Project added successfully');
      setProject({
        projectID: '',
        title: '',
        description: '',
        type: '',
        startDate: '',
        endDate: '',
        status: '',
        budget: '',
        fundingOrgID: '',
        outsourcingOrgID: ''
      });
      navigate('/');
    } else {
      alert('Error adding project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="projectID" className="block text-sm font-medium text-gray-700">Project ID</label>
          <input
            type="text"
            id="projectID"
            name="projectID"
            value={project.projectID}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            name="type"
            value={project.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="research">research</option>
            <option value="consultancy">consultancy</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={project.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="ongoing">ongoing</option>
            <option value="completed">completed</option>
          </select>

        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={project.budget}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="fundingOrgID" className="block text-sm font-medium text-gray-700">Funding Organization</label>
          <select
            id="fundingOrgID"
            name="fundingOrgID"
            value={project.fundingOrgID}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Funding Organization</option>
            {organizations.map((org) => (
              <option key={org.organizationID} value={org.organizationID}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="outsourcingOrgID" className="block text-sm font-medium text-gray-700">Outsourcing Organization</label>
          <select
            id="outsourcingOrgID"
            name="outsourcingOrgID"
            value={project.outsourcingOrgID}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Outsourcing Organization</option>
            {organizations.map((org) => (
              <option key={org.organizationID} value={org.organizationID}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};
