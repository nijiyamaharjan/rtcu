import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      try {
        const response = await fetch('http://localhost:5000/organization/all');
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };
    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/project/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!response.ok) {
        throw new Error('Error adding project');
      }
      toast.success('Project added successfully');
      setProject({
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
      navigate('/projects');
    } catch (error) {
      console.error('Error submitting the project:', error);  // Log the error
      toast.error('Failed to submit the project. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Add New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Project ID', name: 'projectID', type: 'text', required: true },
          { label: 'Title', name: 'title', type: 'text', required: true },
          { label: 'Description', name: 'description', type: 'textarea' },
          { label: 'Budget (in Rs.)', name: 'budget', type: 'text' },
          { label: 'Start Date', name: 'startDate', type: 'date' },
          { label: 'End Date', name: 'endDate', type: 'date' }
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={project[field.name]}
                onChange={handleChange}
                className="w-full mt-1 border rounded p-2"
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={project[field.name]}
                onChange={handleChange}
                className="w-full mt-1 border rounded p-2"
                required={field.required}
              />
            )}
          </div>
        ))}
        {[
          { label: 'Type', name: 'type', options: ['research', 'consultancy'] },
          { label: 'Status', name: 'status', options: ['ongoing', 'completed'] },
          {
            label: 'Funding Organization',
            name: 'fundingOrgID',
            options: organizations.map((org) => ({
              value: org.organizationid,
              label: org.name
            }))
          },
          {
            label: 'Outsourcing Organization',
            name: 'outsourcingOrgID',
            options: organizations.map((org) => ({
              value: org.organizationid,
              label: org.name
            }))
          }
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {field.label}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={project[field.name]}
              onChange={handleChange}
              className="w-full mt-1 border rounded p-2"
              required
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option, index) =>
                typeof option === 'string' ? (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ) : (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};
