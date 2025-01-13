import { useState, useEffect } from "react";
import { TeamMembers } from "../projects/TeamMembers";
import { useParams, useNavigate } from "react-router-dom";

export const ProjectDetail = () => {
  const params = useParams();
  const projectID = params.id;
  const navigate = useNavigate(); // To navigate after delete or update

  const [project, setProject] = useState("");
  const [updatedProject, setUpdatedProject] = useState({
    title: "",
    description: "",
    type: "",
    startdate: "",
    enddate: "",
    status: "",
    fundingorgid: "",
    outsourcingorgid: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`http://localhost:5000/project/${projectID}`);
      const json = await response.json();
      if (response.ok) {
        setProject(json);
        setUpdatedProject({
          title: json.title,
          description: json.description,
          type: json.type,
          startdate: json.startdate,
          enddate: json.enddate,
          status: json.status,
          fundingorgid: json.fundingorgid,
          outsourcingorgid: json.outsourcingorgid,
        });
      }
    };

    fetchProject();
  }, [projectID]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/project/${projectID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    });

    if (response.ok) {
      alert("Project updated successfully");
      setProject({ ...project, ...updatedProject });
    } else {
      alert("Error updating project");
    }
  };

  // Handle delete project
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/project/${projectID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Project deleted successfully");
      navigate("/"); // Redirect to home page after deletion
    } else {
      alert("Error deleting project");
    }
  };

  if (!project) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">{project.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{project.description}</p>

      {/* Project Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <strong className="text-gray-800">Project ID:</strong>
          <p>{project.projectid}</p>
        </div>
        <div>
          <strong className="text-gray-800">Type:</strong>
          <p>{project.type}</p>
        </div>
        <div>
          <strong className="text-gray-800">Start Date:</strong>
          <p>{project.startdate}</p>
        </div>
        <div>
          <strong className="text-gray-800">End Date:</strong>
          <p>{project.enddate}</p>
        </div>
        <div>
          <strong className="text-gray-800">Status:</strong>
          <p>{project.status}</p>
        </div>
        <div>
          <strong className="text-gray-800">Funding Organization:</strong>
          <p>{project.fundingorgid}</p>
        </div>
        <div>
          <strong className="text-gray-800">Outsourcing Organization:</strong>
          <p>{project.outsourcingorgid}</p>
        </div>
      </div>

      {/* Update Form */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Update Project</h3>
      <form onSubmit={handleUpdateSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedProject.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={updatedProject.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={updatedProject.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="startdate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startdate"
            name="startdate"
            value={updatedProject.startdate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="enddate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="enddate"
            name="enddate"
            value={updatedProject.enddate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <input
            type="text"
            id="status"
            name="status"
            value={updatedProject.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="fundingorgid" className="block text-sm font-medium text-gray-700">
            Funding Organization
          </label>
          <input
            type="text"
            id="fundingorgid"
            name="fundingorgid"
            value={updatedProject.fundingorgid}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="outsourcingorgid" className="block text-sm font-medium text-gray-700">
            Outsourcing Organization
          </label>
          <input
            type="text"
            id="outsourcingorgid"
            name="outsourcingorgid"
            value={updatedProject.outsourcingorgid}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Update Project
          </button>
        </div>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Project
        </button>
      </div>

      {/* Team Members */}
      <div className="mt-6">
        <strong className="text-gray-800">Team Members:</strong>
        <TeamMembers projectID={project.projectid} />
      </div>
    </div>
  );
};
